import { Injectable } from '@nestjs/common';
import { IsNull, In, Repository, getManager, FindManyOptions, DeepPartial } from 'typeorm';
import { Update } from './updates.entity';
import { DateTime } from 'luxon';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateInputDto } from './dto/updates-input.dto';
import { HttpErrorHelper } from '../common/helpers/http-error-helper';
import { EmailService } from '../common/services/email/email.service';
import { User } from '../user/user.entity';
import { PostcodeService } from '../postcode/postcode.service';
import { EntityMap } from '../common/dto/entety-map';
import { UpdateParamsInputDto } from './dto/updates-params-input';
import * as uuid from 'uuid/v4';
import { NotificationService } from '../notification/notification.service';
import { NotificationMessage } from '../notification/notification.message';
import * as _ from 'lodash';

@Injectable()
export class UpdateService {
  constructor(
    @InjectRepository(Update)
    private readonly updateRepository: Repository<Update>,
    private readonly emailSrv: EmailService,
    private readonly postcode: PostcodeService,
    private readonly notifi: NotificationService,
  ) {}

  relations = ['organisation', 'event', 'fund', 'user', 'community'];

  async getUpdatesFor(params: UpdateParamsInputDto) {
    const where: any = {};
    where[EntityMap[params.entity].relation] = params.id;
    where.parent_id = IsNull();

    const updates = await this.updateRepository.find({where, relations: this.relations, order: {createdDate: 'DESC'}});
    return await this.getChildCounts(updates);
  }

  async getChildUpdates(id: string) {
    const updates = await this.updateRepository.find({where: {parent_id: id}, relations: this.relations, order: {createdDate: 'DESC'}});
    return await this.getChildCounts(updates);
  }

  async getChildCounts(updates: Update[]) {
    const ids = updates.map(u => u.id);
    if (ids.length) {
      const counts = await this.updateRepository.createQueryBuilder()
        .select(`parent_id`, 'id')
        .addSelect(`count(parent_id)`, 'count')
        .where(`parent_id IN (:...ids)`, {ids})
        .groupBy('parent_id')
        .execute();
      updates.forEach(u => {
        u.children_count = (counts.find(c => c.id === u.id) || {}).count || 0;
      });
    }
    return updates;
  }

  async find(where) {
    return this.updateRepository.find({where });
  }

  async create(update: UpdateInputDto, user: User): Promise<Update> {
    return await getManager().transaction(async transactionalEntityManager => {
      try {
        const date: any = {...update, user: {id: user.id}};
        let newupdate = this.updateRepository.create(date as DeepPartial<Update>);
        newupdate.id = uuid();
        const relations = [
          ...this.relations,
          'organisation.owner',
          'organisation.followers',
          'organisation.theme',
          'toUser',
          'toUser.followers',
          'event.owner',
          'event.theme',
          'event.followers',
          'fund.owner',
          'fund.theme',
          'fund.followers',
          'parent',
          'parent.user',
        ];
        newupdate = await transactionalEntityManager.save(Update, newupdate);
        newupdate = await transactionalEntityManager.findOne(Update, newupdate.id, {relations});
        await this.createNotify(newupdate, user);
        return newupdate;
      } catch (err) {
        HttpErrorHelper.checkDataBaseError(err);
        throw err;
      }
    });
  }

  async createNotify(newupdate: Update, user) {
    let repleyTo: User;
    const parent = await newupdate.parent;
    if (parent) {
      repleyTo = parent.user;
    }
    let entetyName = '';
    if (newupdate.user_id) {
      entetyName = 'toUser';
    }
    if (newupdate.organisation_id) {
      entetyName = 'organisation';
    }
    if (newupdate.fund_id) {
      entetyName = 'fund';
    }
    if (newupdate.event_id) {
      entetyName = 'event';
    }
    if (newupdate.community_id) {
      entetyName = 'community';
    }

    const params = {
      icon:  newupdate[entetyName].photoUrl || _.get(newupdate[entetyName], 'theme.url') || user.photoUrl,
      entity: entetyName,
      entity_id: (newupdate[entetyName].id || newupdate[entetyName].community_id).toString(),
      type: 'update',
      from: user,
    };

    let users = [];

    if (entetyName !== 'community') {
      users = [...(newupdate[entetyName].followers || []), newupdate[entetyName].owner].filter(u => u && u.id !== user.id);
    }
    if (repleyTo) {
      users = users.filter(u => repleyTo.id !== u.id);
      await this.notifi.create({
        text: NotificationMessage.updateReplay({user, data: newupdate[entetyName]}),
        ...params,
      }, [repleyTo]);
    }

    await this.notifi.create({
      text: NotificationMessage.entityHasComment({user, data: newupdate[entetyName]}),
      ...params,
    }, users);
  }

  delete(id: string) {
    return this.updateRepository.delete({ id });
  }

}
