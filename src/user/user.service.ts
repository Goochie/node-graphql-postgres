
import { UserInput } from './dto/user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DateTime } from 'luxon';
import { Repository, getManager, Like, In, Not } from 'typeorm';
import { AuthService, JWT_SECRET } from '../common/services/auth/auth.service';
import { PostCode } from '../postcode/post-code.entity';
import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import * as _ from 'lodash';
import { EmailService } from '../common/services/email/email.service';
import { LoginResponce } from './dto/login-rsp';
import { PostcodeService } from '../postcode/postcode.service';
import * as bcrypt from 'bcrypt';
import { HttpErrorHelper } from '../common/helpers/http-error-helper';
import { FriendshipService } from '../friendship/friendship.service';
import { UserUpdate } from './dto/user.updatet';
import { UserSavingInput } from './dto/saving';
import { UserSaving } from './user-saving.entity';
import { StripeService } from '../common/services/stripe/stripe.service';
import { CardData } from './dto/card.input';
import Stripe = require('stripe');
import { Schedule, InjectSchedule } from 'nest-schedule';
import { Notification } from '../notification/notification.entity';
import { Fund } from '../fund/fund.entity';
import { Event } from '../event/event.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        public readonly userRepository: Repository<User>,
        @InjectRepository(UserSaving)
        public readonly userSavingRepository: Repository<UserSaving>,
        @InjectRepository(Event)
        public readonly eventRepository: Repository<Event>,
        @InjectRepository(Fund)
        public readonly fundRepository: Repository<Event>,
        @InjectRepository(Notification)
        public readonly notificationRepository: Repository<Notification>,
        private readonly postcode: PostcodeService,
        private readonly authSrv: AuthService,
        private readonly emailSrv: EmailService,
        @Inject(forwardRef(() => FriendshipService))
        private readonly frindSrv: FriendshipService,
        private readonly stripeSrv: StripeService,
        @InjectSchedule() private readonly schedule: Schedule,
    ) {
      schedule.scheduleCronJob('send-request', '30 4 * * *', () => {
        this.accumulatedEmail();
        return true;
      });
    }

    async findAll(filter, { skip = 0, take = 1000, noFriends = null}): Promise<User[]> {
        const where: any[] = (filter)
          ? [{email: Like(`%${filter}%`)}, {username: Like(`%${filter}%`)} ]
          : [];
        if (noFriends) {
          const ignoreIds = (await this.frindSrv.findAll(noFriends, true)).map(u => u.id);
          if (ignoreIds && ignoreIds.length) {
            where.forEach(w => w.id = Not(In(ignoreIds)));
          }
        }
        return this.userRepository.find({where, skip, take});
    }

    async accumulatedEmail() {
      const users = await this.findAll('', {take: null});
      for (const user of users) {
        const [requests, notifys] = await Promise.all([
          this.frindSrv.getRequestToUser(user.id),
          this.notificationRepository.find({where: {
            entity: In(['fund', 'event']),
            user: {id: user.id},
            type: 'invite',
            isRead: false,
          }, order: {createdDate: 'DESC'}}),
        ]);
        const fundIds = notifys.filter(n => n.entity === 'fund').map(n => +n.entity_id);
        const eventIds = notifys.filter(n => n.entity === 'event').map(n => +n.entity_id);
        const [funds, events]: [any, any] = await Promise.all([
          fundIds.length ? this.fundRepository.find({where: { id: In(fundIds)}, relations: ['theme', 'owner']}) : [],
          eventIds.length ? this.eventRepository.find({where: { id: In(eventIds)}, relations: ['theme']}) : [],
        ]);

        if (requests.length || funds.length || events.length) {
          events.forEach(e => {
            e.photoUrl = e.photoUrl || e.theme.url;
            e.dates = DateTime.fromJSDate(new Date(e.startDate)).toFormat('dd LLL yyyy') +
              (e.endDate ? (' - ' + DateTime.fromJSDate(new Date(e.endDate)).toFormat('dd LLL yyyy')) : '');
            e.times = e.startTime || 'All day' + (e.endTime ? (' - ' + e.endTime) : '');
          });
          funds.forEach(f => {
            f.photoUrl = f.photoUrl || f.theme.url;
          });
          await this.emailSrv.sendEmail(user.email, '[SLP] Highlights of day', 'accumulated', {
            user, requests, funds, events,
            isFriends: requests.length > 0,
            isFunds: fundIds.length > 0,
            isEvents: events.length > 0,
          });
        }
      }
    }

    async getPaySourceList(user: User) {
      if (!user.stripeId) {
        await this.stripeSrv.createUser(user);
      }
      return this.stripeSrv.sourceList(user);
    }

    async deleteSource(user: User, id: string) {
      if (!user.stripeId) {
        await this.stripeSrv.createUser(user);
      }
      return this.stripeSrv.deleteSource(user, id);
    }

    async connectStripe(code: string, user: User) {
      const oauth = await this.stripeSrv.connect(code);
      user.stripeUserId = oauth.stripe_user_id;
      user.stripeAuthRefreshToken = oauth.refresh_token;
      user.stripeAuthToken = oauth.access_token;
      await this.userRepository.save(user);
    }

    async testStripe(user: User) {
      let oauth: Stripe.oauth.IOAuthToken;
      if (!user.stripeAuthRefreshToken) {
        return false;
      }
      try {
        oauth = await this.stripeSrv.testConnect(user.stripeAuthRefreshToken);
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.log(e);
        return false;
      }
      user.stripeUserId = oauth.stripe_user_id;
      user.stripeAuthRefreshToken = oauth.refresh_token;
      user.stripeAuthToken = oauth.access_token;
      await this.userRepository.save(user);
      return true;
    }

    async deauthorizeConnect(user: User) {
      await this.stripeSrv.deauthorizeConnect(user);
      user.stripeUserId = null;
      user.stripeAuthRefreshToken = null;
      user.stripeAuthToken = null;
      await this.userRepository.save(user);
    }

    async createSourceList(user: User, card: CardData) {
      const sCard = await this.stripeSrv.createSource(card, user);
      await this.userRepository.update({id: user.id}, {defaultPayment: sCard.id});
      return sCard.id;
    }

    async findByEmail(email: string): Promise<User> {
      return this.userRepository.findOne({where: {email: email.toLowerCase()}, relations: ['postcode', 'saving']});
    }

    async updateUserSaving(user: Partial<User>, input: UserSavingInput): Promise<void> {
      user.saving = [{...user.saving[0], ...input, user: {id: user.id}} as UserSaving];
      await this.userSavingRepository.save(user.saving[0]);
    }

    async findByEmails(emails: string[]): Promise<User[]> {
      return this.userRepository.find({where: {email: In(emails.map(email => email.toLowerCase()))}, relations: ['postcode', 'saving']});
    }

    async findById(id: number): Promise<User> {
      return this.userRepository.findOne({where: {id}, relations: ['postcode', 'saving', 'following', 'followers']});
    }

    async findByIds(ids: number[]): Promise<User[]> {
      if (!ids || !ids.length) {
        return [];
      }
      return this.userRepository.find({where: {id: In(ids)}, relations: ['postcode', 'saving']});
    }

    async findByPostcodes(postcodeIds: number[]): Promise<User[]> {
      const query = this.userRepository.createQueryBuilder()
      .select()
      .where(`postcode_id IN (:...postcodeIds)`, {postcodeIds});
      const users = await query.getMany();
      return await this.findByIds(users.map(u => u.id));
    }

    async resetPassword(email: string, url: string): Promise<void> {
      const user = await this.userRepository.findOne({where: {email: email.toLowerCase()}});
      if (!user) {
        throw new NotFoundException('Wrong email');
      }
      user.resetToken = Buffer.from(await bcrypt.hash(user.email + JWT_SECRET + Date.now(), 3)).toString('base64');
      user.resetTokenDate = new Date();
      await await this.userRepository.save(user);
      await this.emailSrv.sendEmail(user.email, 'Reset password', 'reset_pasword', {user, link: `${url}/${user.resetToken}`});
    }

    async requestToVerifyEmail(user: User, url: string, save = true): Promise<void> {
      user.emailVerifyToken = Buffer.from(await bcrypt.hash(user.email + JWT_SECRET + Date.now(), 3)).toString('base64');
      if (save) {
        await await this.userRepository.save(user);
      }
      await this.emailSrv.sendEmail(user.email, '[SLP] Verify email', 'verify_email', {user, link: `${url}/${user.emailVerifyToken}`});
    }

    async verifyEmail(token: string): Promise<void> {
      const user = await this.userRepository.findOne({where: {emailVerifyToken: token}});
      if (!user) {
        throw new NotFoundException('Wrong token');
      }
      user.emailVerifyToken = null;
      await await this.userRepository.save(user);
    }

    async updatePassword(token: string, newPassword): Promise<void> {
      const user = await this.userRepository.findOne({where: {resetToken: token}});
      if (!user) {
        throw new NotFoundException('Wrong token');
      }
      const oneDay = 24 * 60 * 60 * 1000;
      if (user.resetTokenDate.getTime() + oneDay < Date.now()) {
        throw new BadRequestException('Token is outdate');
      }
      user.resetToken = null;
      user.passwordHash = await this.authSrv.generatePassword(newPassword);
      user.resetTokenDate = null;
      await await this.userRepository.save(user);
    }

    async update(id: number, data: UserUpdate, url: string): Promise<void> {
      const user = await this.userRepository.findOne({where: {id}});
      return getManager().transaction(async transactionalEntityManager => {
        let emailVerify = false;
        if (data.email && data.email.toLowerCase() !== user.email) {
          emailVerify = true;
        }
        if (data.password) {
          if (!await this.authSrv.comparePassword(data.oldPassword, user.passwordHash)) {
            throw new BadRequestException({
                message: [{
                  property: 'oldPassword',
                  constraints: {
                    error: 'Wrong current password',
                  },
                }],
              });
          }
          user.passwordHash = await this.authSrv.generatePassword(data.password);
        }
        Object.assign(user, data);
        if (data.postcode) {
          data.postcode = data.postcode.replace(/ /g, '').toUpperCase();
          user.postcode = await this.postcode.findOrCreate(data.postcode, transactionalEntityManager);
        }
        if (emailVerify) {
          await this.requestToVerifyEmail(user, url, false);
        }
        try {
          await transactionalEntityManager.save(User, user);
        } catch (err) {
          HttpErrorHelper.checkDataBaseError(err);
          throw err;
        }
      });
    }

    async create(newUser: UserInput): Promise<LoginResponce> {
      return await getManager().transaction(async transactionalEntityManager => {
        try {
          let user = new User({
            ...(_.omit(newUser, ['postcode'])),
          });
          newUser.postcode = newUser.postcode.replace(/ /g, '').toUpperCase();
          user.postcode = await this.postcode.findOrCreate(newUser.postcode, transactionalEntityManager);
          user.passwordHash = await this.authSrv.generatePassword(newUser.password);
          user = await transactionalEntityManager.save(user);
          await this.emailSrv.sendEmail(user.email, 'Welcome', 'welcome', {user});
          return {
            user,
            token: this.authSrv.createToken(user.email, user.id),
          };
        } catch (err) {
          HttpErrorHelper.checkDataBaseError(err);
          throw err;
        }
      });
    }

    async getProfile(id, user) {
      const users = await this.userRepository.find({where: {id, public: true}, relations: ['postcode', 'saving', 'followers', 'following']});
      await this.prepareFollowed(users, user);
      await this.prepareFollowing(users);
      return users.length>0?users[0]:user;
    }

    async follow(profile_id: number, user: User) {
      const res = await  this.userRepository.createQueryBuilder()
        .insert()
        .into('user_followers')
        .values([{profile_id, user_id: user.id}])
        .onConflict(` DO NOTHING`)
        .execute();
    }

    async unfollow(profile_id: number, user: User) {
      const res = await  this.userRepository.createQueryBuilder()
        .delete()
        .from('user_followers')
        .where([{profile_id, user_id: user.id}])
        .execute();
    }

    async prepareFollowed(users, user) {
      const ids = users.map(o => +o.id);
      const query = this.userRepository.createQueryBuilder('profile')
      .select('profile.id as profile_id')
      .innerJoinAndSelect('profile.followers', 'user')
      .where('profile.id IN (:...ids)', { ids })
      .where('user.id IN (:id)', { id: user.id });
      const followers = await query.execute();
      const fids = followers.map(f => f.profile_id);
      users.forEach(o => {
        o.followed = fids.includes(o.id);
      });
    }

    async prepareFollowing(users) {
      users.map((user) => {
        user.followersCnt = user.followers.length;
        user.followingCnt = user.following.length;
      });
    }
}
