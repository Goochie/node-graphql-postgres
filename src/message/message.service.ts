import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { Repository, getManager, FindManyOptions, DeepPartial, In } from 'typeorm';
import { Message } from './message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageInputDto } from './dto/message-input.dto';
import { EmailService } from '../common/services/email/email.service';
import { User } from '../user/user.entity';
import { PostcodeService } from '../postcode/postcode.service';
import * as uuid from 'uuid/v4';
import { UserService } from '../user/user.service';
import { FriendOut } from '../user/dto/friend.out';
import { dateApplyTimeZone } from '../common/helpers/entity.helper';
import { HttpErrorHelper } from '../common/helpers/http-error-helper';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(forwardRef(() => UserService))
    private readonly userSrv: UserService,
  ) {}

  relations = ['from', 'to', 'reactTo'];

  async getMessagesFor(userId: number, to: number) {
    const where: any = [{
      from: {id: userId},
      to: {id: to},
    }, {
      from: {id: to},
      to: {id: userId},
    }];

    return await this.messageRepository.find({where, relations: this.relations, order: {createdDate: 'ASC'}});
  }

  async getLast(userId, friendIds) {
    if (!friendIds.length) {
      return [];
    }
    const where: any = [{
      from: {id: userId},
      to: {id: In(friendIds)},
    }, {
      from: {id: In(friendIds)},
      to: {id: userId},
    }];

    const messages = await this.messageRepository.createQueryBuilder('message')
    .select('DISTINCT ON(from_id, to_id) from_id, to_id, message.text as last_message, message.created_date as last_date, is_read')
    .where(where)
    .orderBy({from_id: 'ASC', to_id: 'ASC', created_date: 'DESC'})
    .execute();
    return messages.reduce((a, msg) => {
      const fid = (msg.from_id === userId) ? msg.to_id : msg.from_id;
      if (!a[fid]) {
        a[fid] = msg;
      } else if (a[fid].last_date < msg.last_date) {
        a[fid] = msg;
      }
      if (msg.from_id === userId) {
        msg.is_read = true;
      }
      return a;
    } ,{});
  }

  async getMyChats(userId) {
    const where: any = [{
      from: {id: userId},
    }, {
      to: {id: userId},
    }];

    let messages = await this.messageRepository.createQueryBuilder('message')
    .select('DISTINCT ON(from_id, to_id) from_id, to_id, message.text as last_message, message.created_date as last_date, is_read')
    .where(where)
    .orderBy({from_id: 'ASC', to_id: 'ASC', created_date: 'DESC'})
    .execute();
    const usersIds = [];
    messages = messages.reduce((a, msg) => {
      const fid = (msg.from_id === userId) ? msg.to_id : msg.from_id;
      if (!a[fid]) {
        a[fid] = msg;
      } else if (a[fid].last_date < msg.last_date) {
        a[fid] = msg;
      }
      if (msg.from_id === userId) {
        msg.is_read = true;
      }
      usersIds.push(fid);
      return a;
    }, {});
    const users = await this.userSrv.findByIds(usersIds);

    return users.map((u: FriendOut) => {
      u.lastDate = dateApplyTimeZone.from(messages[u.id].last_date);
      u.lastMessage = messages[u.id].last_message;
      u.isRead = messages[u.id].is_read;
      return u;
    }).sort((a, b) => (new Date(b.lastDate)).getTime() - (new Date(a.lastDate)).getTime());

  }

  async markAll(userId: number, from: number) {
    const where: any = {
      from: {id: from},
      to: {id: userId},
    };

    const message = await this.messageRepository.update(where, {isRead: true});
  }

  async find(where, relations = []) {
    return this.messageRepository.find({ where, relations });
  }

  async create(message: MessageInputDto, user: Partial<User>): Promise<Message> {
    return await getManager().transaction(async transactionalEntityManager => {
      try {
        const date: any = {...message, from: {id: user.id}};
        let newmessage = this.messageRepository.create(date as DeepPartial<Message>);
        newmessage.id = uuid();
        newmessage = await transactionalEntityManager.save(Message, newmessage);
        newmessage = await transactionalEntityManager.findOne(Message, newmessage.id, {relations: this.relations});

        return newmessage;
      } catch (err) {
        HttpErrorHelper.checkDataBaseError(err);
        throw err;
      }
    });
  }

  async createBulk(message: Partial<Message>, users: Array<Partial<User>>): Promise<void> {
    return await getManager().transaction(async transactionalEntityManager => {
      try {
        const data: any = users.map(u => {
          return {
            ...message,
            id: uuid(),
            to: {id: u.id},
          };
        });
        await transactionalEntityManager.save(Message, data);
      } catch (err) {
        throw err;
      }
    });
  }

  delete(id: string) {
    return this.messageRepository.delete({ id });
  }

  async edit(id: string, text: string) {
    await this.messageRepository.update(id, {text});
  }
}
