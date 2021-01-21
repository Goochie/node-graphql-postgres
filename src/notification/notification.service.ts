import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { IsNull, In, Repository, getManager, FindManyOptions, DeepPartial } from 'typeorm';
import { Notification } from './notification.entity';
import { DateTime } from 'luxon';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../common/services/email/email.service';
import { User } from '../user/user.entity';
import { PostcodeService } from '../postcode/postcode.service';
import * as uuid from 'uuid/v4';
import { MessageService } from '../message/message.service';
import { NotificationMessage } from './notification.message';
import { type } from 'os';
import { UserService } from '../user/user.service';
import { RelatedUser } from '../common/dto/related-user';
import { Organisation } from '../organisation/organisation.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly message: MessageService,
    @Inject(forwardRef(() => UserService))
    private readonly userSrv: UserService,
    private readonly emailSrv: EmailService,
    @InjectRepository(Organisation)
    private readonly organisationRepository: Repository<Organisation>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  relations = ['user', 'from'];

  async getNotificationsFor(user: User) {
    return await this.notificationRepository.find({where: {user: user.id},
      relations: this.relations,
      take: 1000,
      order: {isRead: 'ASC', createdDate: 'DESC'}});
  }

  async markRead(id: string, action: string) {
    await this.notificationRepository.update({id}, {isRead: true, action});
  }

  async markAllRead(userId: number) {
    await this.notificationRepository.update({user: {id: userId}}, {isRead: true});
  }

  async create(notification: Partial<Notification>, users: Array<Partial<User>>): Promise<void> {
    return await getManager().transaction(async transactionalEntityManager => {
      try {
        const data: Notification[] = users.map(user => {
          const newnotification = this.notificationRepository.create({...notification, user: {id: user.id}} as DeepPartial<Notification>);
          newnotification.id = uuid();
          return newnotification;
        });
        await transactionalEntityManager.save(Notification, data);
      } catch (err) {
        throw err;
      }
    });
  }

  async inviteToByEmail(
    entity: string,
    entity_id,
    title: string,
    users: RelatedUser[],
    author: User,
    url: string,
  ) {
    const localUsers: RelatedUser[] = (await this.userSrv.findByEmails(users.map(u => u.email))).map(u => ({...u, id: u.id.toString()}));
    const noLocalEmail = users.filter(u => !localUsers.find(lu => lu.email === u.email.toLowerCase()));
    const promises = noLocalEmail.map(u => this.emailSrv.sendEmail(u.email, 'Invite to SLP', 'invite', {user: u, link: url}));
    await Promise.all(promises);
    await this.inviteTo(entity, entity_id, title, localUsers as RelatedUser[], author);
  }

  prefix = 'dash-board';

  async inviteTo(
    entity: string,
    entity_id,
    title: string,
    users: RelatedUser[],
    author: User,
  ) {
    const lusers = users.map(u => ({id: +u.id}))
    await this.create({
      text: NotificationMessage.inviteUser({type: entity, user: author, data: {title}}),
      type: 'invite',
      entity, entity_id, from: author, icon: author.photoUrl,
    }, lusers);
    await this.message.createBulk({
      text: `Invites you to join <a href="${this.prefix}/${entity}/${entity_id}">${title}</a> ${entity}`,
      from: author,
    }, lusers);
  }

  delete(id: string) {
    return this.notificationRepository.delete({ id });
  }

  async inviteAllFollowers(
    entity: string,
    entity_id,
    title: string,
    sender_type: string,
    sender_id: string = '2',
    author: User,
  ){
    let followers;
    let relatedFollowers;
    if(sender_type == 'org'){
      const organization = await this.organisationRepository.findOne(sender_id, { relations: ['followers'] })
      followers = organization.followers;
      relatedFollowers =  followers.map(user => ({
        ...user,
        id: `${user.id}`
      }))
    }else{
      const user = await this.userRepository.findOne(sender_id, { relations: ['followers'] })
      followers = user.followers;
      relatedFollowers =  followers.map(user => ({
        ...user,
        id: `${user.id}`
      }))
    }
    

    await this.inviteTo(entity, entity_id, title, relatedFollowers, author)
  }

}
