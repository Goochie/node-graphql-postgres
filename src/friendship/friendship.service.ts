
import { InjectRepository } from '@nestjs/typeorm';
import { Friendship } from './friendship.entity';
import { Repository, getManager, In } from 'typeorm';
import { Injectable, NotFoundException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import * as _ from 'lodash';
import { FriendshipStatus } from './friendship.status';
import { User } from '../user/user.entity';
import { EmailService } from '../common/services/email/email.service';
import { UserService } from '../user/user.service';
import { FriendOut } from '../user/dto/friend.out';
import { MessageService } from '../message/message.service';
import { text } from 'body-parser';
import { InviteInput } from '../notification/dto/invite.input';
import { NotificationService } from '../notification/notification.service';
import { NotificationMessage } from '../notification/notification.message';

@Injectable()
export class FriendshipService {
    constructor(
        @InjectRepository(Friendship)
        private readonly friendshipRepository: Repository<Friendship>,
        private readonly emailSrv: EmailService,
        @Inject(forwardRef(() => UserService))
        private readonly userSrv: UserService,
        @Inject(forwardRef(() => MessageService))
        private readonly meeageSrv: MessageService,

        private notification: NotificationService,
    ) {}

    async findAll(id: number, notApprove = false, ): Promise<FriendOut[]> {

      const first: any = { userId: id };
      if (!notApprove) {
        first.status = In([FriendshipStatus.APPROVED, FriendshipStatus.REQUEST]);
      }

      const result = await this.friendshipRepository.createQueryBuilder('friendship')
        .select()
        .where([first, {
          status: In([FriendshipStatus.APPROVED, FriendshipStatus.REQUEST]),
          friendId: id,
        }])
        .innerJoinAndSelect('friendship.user', 'user')
        .innerJoinAndSelect('friendship.friend', 'friend')
        .getMany();

      const friends: FriendOut[] = result.map(f => {
        const user = (new User((f.user.id !== id) ? f.user : f.friend));
        user.status = f.status;
        if ((f.user.id === id) && f.status === FriendshipStatus.REQUEST) {
          user.status = 'PENDING';
        }
        return user;
      });
      friends.forEach(d => d.lastMessage = 'Mock last message');
      await this.lastMessage(friends, id);
      return friends;
    }

    async getRequestToUser(userId: number) {
      const result = await this.friendshipRepository.createQueryBuilder('friendship')
        .select()
        .where({
          status: In([FriendshipStatus.REQUEST]),
          friendId: userId,
        })
        .innerJoinAndSelect('friendship.user', 'user')
        .innerJoinAndSelect('friendship.friend', 'friend')
        .getMany();

      const friends: FriendOut[] = result.map(f => {
        const user = (new User(f.user));
        user.status = f.status;
        return user;
      });

      return friends;
    }

    async lastMessage(friends, id) {
      const messages = await this.meeageSrv.getLast(id, friends.map(f => f.id));

      friends.forEach(f => {
        f.lastMessage = (messages[f.id]) ? messages[f.id].last_message : '';
        f.lastDate = (messages[f.id]) ? messages[f.id].last_date : null;
        f.isRead = (messages[f.id]) ? messages[f.id].is_read : null;
      });
    }

    async removeFriendship(user: User, friendId: number) {
      const existFriendship = await this.friendshipRepository.findOne({where: [{
        userId: user.id,
        friendId,
      }, {
        friendId: user.id,
        userId: friendId,
      }]});

      if (!existFriendship) {
        throw new BadRequestException('You are not friends');
      }

      this.notification.create({
        text: NotificationMessage.removeFromFriends({user}),
        icon:  user.photoUrl,
        entity: 'user',
        entity_id: user.id.toString(),
        type: 'remove',
        from: user,
      }, [{id: friendId}]);

      this.friendshipRepository.delete(existFriendship);
    }

    async requestFriendship(userId: number, friendId: number, message: string, url: string) {
      const friendship = this.friendshipRepository.create({
        user: {id: userId},
        friend: {id: friendId},
      });
      const promises = [];
      promises.push(this.friendshipRepository.findOne({where: [{
        userId,
        friendId,
      }, {
        friendId: userId,
        userId: friendId,
      }]}));
      promises.push(this.userSrv.findById(userId), this.userSrv.findById(friendId));
      const [existFriendship, user, friend] = await Promise.all(promises);
      if (!existFriendship) {
        await this.friendshipRepository.save(friendship);
        this.notification.create({
          text: NotificationMessage.addToFriends({user}),
          icon:  user.photoUrl,
          entity: 'user',
          entity_id: user.id.toString(),
          type: 'request',
          from: user,
        }, [{id: friendId}]);
        this.emailSrv.sendEmail(friend.email, 'Friendship request', 'friendship-request', {user, link: `${url}/${user.id}`, message});
      } else if (existFriendship.friendId === userId) {
        existFriendship.status = FriendshipStatus.APPROVED;
        await this.friendshipRepository.save(existFriendship);
        this.notification.create({
          text: NotificationMessage.acceptFriendRequest({user}),
          icon:  user.photoUrl,
          entity: 'user',
          entity_id: user.id.toString(),
          type: 'approve',
          from: user,
        }, [{id: friendId}]);
        await this.meeageSrv.create({to: {id: friendId}, text: 'Friend request accepted'}, {id: userId});
        this.emailSrv.sendEmail(friend.email, 'Approve your request', 'friendship-approve', {user});
      }
    }
}