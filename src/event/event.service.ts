import { Injectable, Logger } from '@nestjs/common';
import { IsNull, In, Repository, getManager, FindManyOptions, SelectQueryBuilder } from 'typeorm';
import { Event } from './event.entity';
import { DateTime } from 'luxon';
import { InjectRepository } from '@nestjs/typeorm';
import { EventInputDto } from './dto/event-input.dto';
import { HttpErrorHelper } from '../common/helpers/http-error-helper';
import { EmailService } from '../common/services/email/email.service';
import { User } from '../user/user.entity';
import { PostcodeService } from '../postcode/postcode.service';
import { EventQuerySetting } from './dto/event-query-setting';
import { NotificationService } from '../notification/notification.service';
import { NotificationMessage } from '../notification/notification.message';
import { SmartCalendarFilter, WeekDays, daysOfWeek } from './dto/smart-calendar.input';
import { SmartCalendarResult } from './dto/smart-calendar.out';
import { EventUpdateDto } from './dto/event-update.dto';
import { EventGroup } from './event-group.entity';
import { RecurringService } from '../recurring/recurring.service';
import { Recurring } from '../recurring/recurring.entity';
import * as moment from 'moment';
import { EventGroupInputDto } from './dto/event-group-input.dto';
import { EventGroupUpdateDto } from './dto/event-group-update.dto';
import { SchoolYear } from '../common/school-year/school-year.entity';
import { EventDocumentService } from '../event-document/event-document.service';

const HOLIDAYS = {
  12: [25, 26],
  1: [1],
  4: [10, 13],
  5: [8, 25],
  8: [31],
};

const schoolHoliday = [
  {
    start: 43,
    end: 44,
  },
  {
    start: 52,
    end: 1,
  },
  {
    start: 8,
    end: 9,
  },
  {
    start: 15,
    end: 16,
  },
  {
    start: 22,
    end: 22,
  },
  {
    start: 29,
    end: 35,
  },
];

/**
 * @returns minutes number
 * '11:25' => 685
 */
export function strTimeToNumber(time: string): number {
  if (!time) {
    return null;
  }
  try {
    const [timePart, ampm] = time.split(' ');
    let [hours, min] = timePart.split(':').map(a => +a);
    if (ampm) {
      if (ampm === 'PM' && hours < 12) {
        hours = hours + 12;
      }
      if (ampm === 'AM' && hours === 12) {
        hours = hours - 12;
      }
    }
    return (hours * 60) + (min);
  } catch {
    return 0;
  }
}

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventGroup)
    private readonly groupRepository: Repository<EventGroup>,
    @InjectRepository(SchoolYear)
    private readonly schoolyearRepository: Repository<SchoolYear>,
    private readonly emailSrv: EmailService,
    private readonly postcode: PostcodeService,
    private readonly doc: EventDocumentService,
    private readonly recurring: RecurringService,
    private readonly notification: NotificationService,
    private readonly logger: Logger,
  ) {}

  relations = ['postcode', 'category', 'schoolYear', 'theme', 'owner', 'assign', 'organisation', 'recurring', 'documents', 'groups'];
  groupRelations = ['postcode', 'category', 'theme', 'owner', 'assign', 'organisation', 'events'];

  async find(where: any, option: EventQuerySetting = {}, limit?: number) {
    let localWhere;
    localWhere = [where];
    if (Array.isArray(where)) {
      localWhere = [...where];
    }
    for (const i in localWhere) {
      if (localWhere[i]) {
        if (localWhere[i].event_followers) {
          const ids = await this.followEventIds(localWhere[i].event_followers);
          localWhere[i].id = In([0, ...ids]);
          delete localWhere[i].event_followers;
        }
        localWhere[i] = { deletedDate: IsNull(), ...localWhere[i] };
      }
    }
    const queryParams: FindManyOptions = {where: localWhere, relations: this.relations};
    const query = this.eventRepository.createQueryBuilder('event').select()
    .where(queryParams.where);
    queryParams.relations.forEach(re => {
      query.leftJoinAndSelect(`event.${re}`, re);
    });
    if (option.order === 'date') {
      query.addOrderBy('event.startDate', 'ASC');
      query.addOrderBy('event.startTime', 'ASC', 'NULLS FIRST');
    }
    
    const events = await query.getMany();
    for(const event of events) {
      if(event.groups) {
        for(const group of event.groups) {
          group.events = await this.groupRepository
          .createQueryBuilder()
          .relation(EventGroup, "events")
          .of(group)
          .loadMany();
          group.theme = await this.groupRepository
          .createQueryBuilder()
          .relation(EventGroup, "theme")
          .of(group)
          .loadOne();
        }
      }
    }
    const promises = [];
    if (option.isIFollow && events.length) {
      promises.push(this.prepareFollowed(events, option));
    }
    if  (events.length) {
      promises.push(this.getCounts(events));
    }
    await Promise.all(promises);
    return events;
  }

  async findGroup(where: any, option: EventQuerySetting = {}) {
    let localWhere;
    localWhere = [where];
    if (Array.isArray(where)) {
      localWhere = [...where];
    }
    for (const i in localWhere) {
      if (localWhere[i]) {
        localWhere[i] = { deletedDate: IsNull(), ...localWhere[i] };
      }
    }
    const queryParams: FindManyOptions = {where: localWhere, relations: this.groupRelations};
    const query = this.groupRepository.createQueryBuilder('group').select()
    .where(queryParams.where);
    queryParams.relations.forEach(re => {
      query.leftJoinAndSelect(`group.${re}`, re);
    });
    const groups = await query.getMany();
    const promises = [];
    if  (groups.length) {
      promises.push(this.getCounts(groups));
    }
    await Promise.all(promises);
    return groups;
  }

  async getGroups(uId: number) {
    return this.groupRepository.find({
      where: {
        user: {id: uId},
        deletedDate: IsNull()
      },
      relations: this.groupRelations
    });
  }

  async createGroup(group: EventGroupInputDto, user: User): Promise<EventGroup> {
    return await getManager().transaction(async transactionalEntityManager => {
      try {
        group.postcode = (group.postcode) ? group.postcode.replace(/ /g, '').toUpperCase() : null;
        let newGroup = new EventGroup({
          ...group,
          owner: user,
          postcode: group.postcode ? (await this.postcode.findOrCreate(group.postcode, transactionalEntityManager)) : undefined
        });
        newGroup = await transactionalEntityManager.save(EventGroup, newGroup);
        newGroup = await transactionalEntityManager.findOne(EventGroup, newGroup.id, {relations: this.groupRelations});
        return newGroup;
      } catch (err) {
        HttpErrorHelper.checkDataBaseError(err);
        throw err;
      }
    });
  }
  async updateGroup(groupPath: EventGroupUpdateDto, group: EventGroup, user: User): Promise<EventGroup> {
    return await getManager().transaction(async transactionalEntityManager => {
      try {
        for (let key in groupPath) {
          if (groupPath[key] === undefined) {
            delete groupPath[key];
          }
        }
        let newPostCode = group.postcode;
        if (groupPath.postcode) {
          newPostCode = await this.postcode.findOrCreate(groupPath.postcode, transactionalEntityManager);
        } else if (groupPath.postcode === '') {
          newPostCode = null;
        }
        await transactionalEntityManager.save(EventGroup, new EventGroup({
          ...group,
          ...groupPath,
          postcode: newPostCode,
        }), {});
        return transactionalEntityManager.findOne(EventGroup, groupPath.id, {relations: this.groupRelations});
      } catch (err) {
        HttpErrorHelper.checkDataBaseError(err);
        throw err;
      }
    });
  }
  async deleteGroup(id: number) {
    return this.groupRepository.update({id}, {deletedDate: new Date()});
  }
  async cloneGroup(id: number) {
    const group = await this.groupRepository.findOne({where: {id}, relations: this.groupRelations});
    delete group.id;
    return await this.groupRepository.save(group);
  }

  async getEventForCommunity(communityId, option: EventQuerySetting) {
    const postcodeIds = (await this.postcode.findCommunity(communityId)).map(p => p.id);
    postcodeIds.push(0);
    const query = this.eventRepository.createQueryBuilder('event')
      .select()
      .leftJoin('event.owner', 'owner')
      .leftJoin('event.organisation', 'org')
      .where('event.deleted_date IS NULL');

    query.andWhere(`
      CASE
        WHEN "org"."postcode_id" is not NULL THEN "org"."postcode_id"
        WHEN "owner"."postcode_id" is not NULL THEN "owner"."postcode_id"
      END IN (:...postcodeIds)`, {postcodeIds});

    const events = await query.getMany();
    if (events.length) {
      return this.find({id: In(events.map(e => e.id))}, option);
    }
    return [];
  }

  async _getPopularEventsByPostcodes(postcodeIds: number[], option: EventQuerySetting, limit: number = 6){
    const query = this.eventRepository.createQueryBuilder('event')
      .select()
      .leftJoin('event.owner', 'owner')
      .leftJoin('event.organisation', 'org')
      .leftJoin('event.followers', 'user')
      .addSelect('count(user.id) as follower_count')
      .where('event.deleted_date IS NULL')
      .groupBy('event.id')
      .orderBy('follower_count', 'DESC', 'NULLS LAST')
      .limit(limit)

    query.andWhere(`
      CASE
        WHEN "org"."postcode_id" is not NULL THEN "org"."postcode_id"
        WHEN "owner"."postcode_id" is not NULL THEN "owner"."postcode_id"
      END IN (:...postcodeIds)`, {postcodeIds});

    const events = await query.getMany();
    
    if (events.length) {
      const eventPromises = events.map(event => {
        return this.find({id: event.id}, option);
      })

      const eventsEntities = await Promise.all(eventPromises);
      
      return eventsEntities.map(events => events[0]);
    }
    return [];
  }

  async getPopularEventsForCommunity(communityId: string, option: EventQuerySetting){
    const userCommunityPostcodes = (await this.postcode.findCommunity(communityId));
    const userCommunityPostcodesIds = userCommunityPostcodes.map(postcode => postcode.id);
    const additionalPostcodeIds = await this.postcode.getPostcodesWithIncreasedRadius(userCommunityPostcodes);
    const flattenPostcodes = additionalPostcodeIds.flat();
    
    let events = await this._getPopularEventsByPostcodes(userCommunityPostcodesIds, option);

    if(events.length === 0){
      events = await this._getPopularEventsByPostcodes(flattenPostcodes, option);
    } 

    this.logger.log(events, 'EVENTS');

    return events;
  }

  async followEventIds(user_id: number) {
    const res = await this.eventRepository.createQueryBuilder('event')
      .select('event.id as event_id')
      .innerJoinAndSelect('event.followers', 'user')
      .where('user.id IN (:id)', {id: user_id})
      .execute();
    return res.map(r => r.event_id);
  }

  async follow(event_id: number, user: User, data: Event) {
    const res = await  this.eventRepository.createQueryBuilder()
      .insert()
      .into('event_followers')
      .values([{event_id, user_id: user.id}])
      .onConflict(` DO NOTHING`)
      .execute();
    if (res.identifiers[0]) {
      this.notification.create({
        text: NotificationMessage.entityUserJoin({user, data, type: 'event'}),
        icon:  user.photoUrl,
        entity: 'event',
        entity_id: data.id.toString(),
        type: 'follow',
        from: user,
      }, [...(data.followers || []), data.owner].filter(u => u.id !== user.id));
    }
  }

  async getGoing(event_id: number, user_id: number): Promise<User[]> {
    const res = await this.eventRepository.createQueryBuilder('event')
      .select()
      .where('event.id IN (:event_id)', {event_id})
      .innerJoinAndSelect('event.followers', 'followers')
      .getOne();
    try {
      return res.followers;
    } catch (e) {
      return [];
    }
  }

  async unfollow(event_id: number, user: User, data: Event) {
    const res = await  this.eventRepository.createQueryBuilder()
      .delete()
      .from('event_followers')
      .where([{event_id, user_id: user.id}])
      .execute();
    if (res.affected > 0) {
      this.notification.create({
        text: NotificationMessage.entityUserLeft({user, data, type: 'event'}),
        icon:  user.photoUrl,
        entity: 'event',
        entity_id: data.id.toString(),
        type: 'unfollow',
        from: user,
      }, [...(data.followers || []), data.owner].filter(u => u.id !== user.id));
    }
  }

  async prepareFollowed(events, option: EventQuerySetting) {
    const ids = events.map(o => +o.id);
    const query = this.eventRepository.createQueryBuilder('event')
    .select('event.id as event_id')
    .innerJoinAndSelect('event.followers', 'user')
    .where('event.id IN (:...ids)', { ids })
    .where('user.id IN (:id)', { id: option.isIFollow })
    const followers = await query.execute();
    const fids = followers.map(f => f.event_id);
    events.forEach(o => {
      o.followed = fids.includes(o.id);
    });
  }

  async getCounts(events) {
    const ids = events.map(o => +o.id);
    const query = this.eventRepository.createQueryBuilder('event')
      .select('event.id as event_id')
      .leftJoin('event.followers', 'user')
      .leftJoin('event.updates', 'updates')
      .addSelect('count(user.id) as follower_count')
      .addSelect('count(updates.id) as updates_count')
      .where('event.id IN (:...ids)', { ids })
      .groupBy('event.id');
    const counters = await query.execute();
    events.forEach(e => {
      const counter = (counters.find(f => f.event_id === e.id) || {});
      e.follower_count = counter.follower_count || 0;
      e.updates_count = counter.updates_count || 0;
    });
  }

  async create(event: EventInputDto, user: User): Promise<Event> {
    return await getManager().transaction(async transactionalEntityManager => {
      try {
        event.postcode = (event.postcode) ? event.postcode.replace(/ /g, '').toUpperCase() : null;
        let recurring_info = event.recurring ? (await this.recurring.create(new Recurring({
          ...(event.recurring_info)
        }), transactionalEntityManager)) : null;
        let newEvent = new Event({
          ...event,
          owner: user,
          postcode: event.postcode ? (await this.postcode.findOrCreate(event.postcode, transactionalEntityManager)) : undefined,
          recurring: recurring_info
        });
        for(let i = 0; i < event.documents.length; i ++) {
          const doc = event.documents[i];
          const findDoc = await this.doc.find(doc.id);
          findDoc.description = doc.description;
          this.doc.save(findDoc);
        }
        if (event.startDate) {
          newEvent.startDate = DateTime.fromJSDate(new Date(event.startDate)).toISO();
        } else {
          newEvent.startDate = null;
        }
        if (event.endDate) {
          newEvent.endDate = DateTime.fromJSDate(new Date(event.endDate)).toISO();
        } else {
          newEvent.endDate = null;
        }
        newEvent.startTimeI = strTimeToNumber(event.startTime);
        newEvent.endTimeI = strTimeToNumber(event.endTime);
        let savedId = 0;
        if(!recurring_info || !newEvent.startDate) {
          const savedEvent = await transactionalEntityManager.save(Event, new Event({...newEvent}));
          savedId = savedEvent.id;
        } else {

          let dayDiff = -1;
          if(newEvent.endDate) {
            dayDiff = moment(newEvent.endDate).diff(moment(newEvent.startDate), 'days');
          }

          if(recurring_info.repeatMode == 1) {
            let firstDay = moment(newEvent.startDate);
            if(recurring_info.endMode == 2) {
              recurring_info.endDate = DateTime.fromJSDate(firstDay.clone().add(recurring_info.countDays, 'days').toDate()).toISO();
            }
            while(firstDay.isBefore(moment(recurring_info.endDate))) {
              newEvent.startDate = DateTime.fromJSDate(firstDay.toDate()).toISO();
              if(dayDiff >= 0) {
                newEvent.endDate = DateTime.fromJSDate(moment(newEvent.startDate).add(dayDiff, 'days').toDate()).toISO();
              }
              const savedEvent = await transactionalEntityManager.save(Event, new Event({...newEvent}));
              if(savedId == 0) {
                savedId = savedEvent.id;
              }
              firstDay.add(1, 'days');
            }
          }

          if(recurring_info.repeatMode == 2) {
            const weekdays = recurring_info.repeatDays.split(',');
            let firstDay = moment(newEvent.startDate).day(1);
            if(moment(newEvent.startDate).day() == 0) {
              firstDay.day(1 - 7);
            }
            if(recurring_info.endMode == 2) {
              recurring_info.endDate = DateTime.fromJSDate(firstDay.clone().add(recurring_info.countDays, 'weeks').toDate()).toISO();
            }
            while(firstDay.isBefore(moment(recurring_info.endDate))) {
              for(let i = 0; i < weekdays.length; i ++) {
                const d = +weekdays[i];
                if(firstDay.clone().add((d - 1), 'days').isBefore(moment(newEvent.startDate))) {
                  firstDay.add(1, 'weeks');
                  continue;
                }
                newEvent.startDate = DateTime.fromJSDate(firstDay.clone().add((d - 1), 'days').toDate()).toISO();
                if(dayDiff >= 0) {
                  newEvent.endDate = DateTime.fromJSDate(moment(newEvent.startDate).add(dayDiff, 'days').toDate()).toISO();
                }
                const savedEvent = await transactionalEntityManager.save(Event, new Event({...newEvent}));
                if(savedId == 0) {
                  savedId = savedEvent.id;
                }
              }
              firstDay.add(1, 'weeks');
            }
          }

          if(recurring_info.repeatMode == 3) {
            let firstDay = moment(newEvent.startDate).startOf('month');
            if(recurring_info.endMode == 2) {
              recurring_info.endDate = DateTime.fromJSDate(firstDay.clone().add(recurring_info.countDays, 'months').toDate()).toISO();
            }
            while(firstDay.isBefore(moment(recurring_info.endDate))) {
              if(recurring_info.monthlyOption == 1) {
                if(firstDay.clone().add((recurring_info.repeatDate - 1), 'days').isBefore(moment(newEvent.startDate))) {
                  firstDay.add(1, 'months');
                  continue;
                }
                newEvent.startDate = DateTime.fromJSDate(firstDay.clone().add((recurring_info.repeatDate - 1), 'days').toDate()).toISO();
              }
              if(recurring_info.monthlyOption == 2) {
                if(recurring_info.repeatPos < 0) {
                  firstDay.endOf('month');
                }
                let newDay = firstDay.clone();
                if(recurring_info.repeatPos > 0) {
                  const weekday = (firstDay.day() + 6) % 7 + 1;
                  if(recurring_info.repeatDay < weekday) {
                    newDay.add(7 - weekday + recurring_info.repeatDay, 'days');
                  } else {
                    newDay.add(recurring_info.repeatDay - weekday, 'days');
                  }
                  newDay.add(recurring_info.repeatPos - 1, 'weeks');
                }
                if(recurring_info.repeatPos < 0) {
                  const weekday = (firstDay.day() + 6) % 7 + 1;
                  if(recurring_info.repeatDay > weekday) {
                    newDay.add(recurring_info.repeatDay - 7 - weekday, 'days');
                  } else {
                    newDay.add(recurring_info.repeatDay - weekday, 'days');
                  }
                }
                if(newDay.isBefore(moment(newEvent.startDate))) {
                  firstDay.add(1, 'months');
                  continue;
                }
                newEvent.startDate = DateTime.fromJSDate(newDay.toDate()).toISO();
              }
              if(dayDiff >= 0) {
                newEvent.endDate = DateTime.fromJSDate(moment(newEvent.startDate).add(dayDiff, 'days').toDate()).toISO();
              }
              const savedEvent = await transactionalEntityManager.save(Event, new Event({...newEvent}));
              if(savedId == 0) {
                savedId = savedEvent.id;
              }
              firstDay.add(1, 'months');
            }
          }
        }
        
        const finalEvent = await transactionalEntityManager.findOne(Event, savedId, {relations: this.relations});
        if(finalEvent) {
          const title =  `Event ${finalEvent.title} is created`;
          this.emailSrv.sendEmail(user.email, title, 'event_create', {event});
        }
        return finalEvent;
      } catch (err) {
        HttpErrorHelper.checkDataBaseError(err);
        throw err;
      }
    });
  }

  weekDayQuery(query: SelectQueryBuilder<Event>, days: WeekDays) {
    const dayQ = `extract(isodow from event."startDate")`;
    const where = []

    for (let day in days) {
      if (days[day] && daysOfWeek.indexOf(day) > -1) {
        where.push(`${1 + daysOfWeek.indexOf(day)}`);
      }
    }

    query.andWhere(`${dayQ} IN (:...days)`, {days: where});
  }

  byDates(query: SelectQueryBuilder<Event>, dates: string[]) {
    const where = dates.map(d => {
      const [year, month, day] = d.split('-');
      return this.generateToDay(day, month, year);
    });

    query.andWhere(`(${where.join(' OR ')})`);
  }

  async smartCalendar(filter: SmartCalendarFilter, me: User, option: EventQuerySetting = {}): Promise<SmartCalendarResult> {
    const where: any = {}

    const query = this.eventRepository.createQueryBuilder('event')
      .select()
      .leftJoin('event.postcode', 'postcode_event')
      .leftJoin('event.owner', 'owner')
      .leftJoin('event.organisation', 'org')
      .leftJoin('event.category', 'category')
      .where('event.deleted_date IS NULL');

    if (filter.forMe) {
      const ids = await this.followEventIds(me.id);
      query.andWhere(`(event.owner_id = :me OR event.id IN (:...ids))`, {me: me.id, ids: [0, ...ids]});
    }

    if (filter.coordinates) {
      const postcodeIds = (await this.postcode.searchNear(filter.coordinates, filter.radius)).map(p => p.id);
      postcodeIds.push(0);
      query.andWhere(`
        CASE
          WHEN "postcode_event"."id" is not NULL THEN "postcode_event"."id"
          WHEN "org"."postcode_id" is not NULL THEN "org"."postcode_id"
          WHEN "owner"."postcode_id" is not NULL THEN "owner"."postcode_id"
        END IN (:...postcodeIds)`, {postcodeIds});
    }

    if (filter.category && filter.category.length) {
      query.andWhere(`category.id IN (:...categories)`, {categories: filter.category.map(c => c.id)});
    }

    if (filter.from && filter.to) {
      let to = strTimeToNumber(filter.to);
      let from = strTimeToNumber(filter.from);
      if (filter.plusTime) {
        to = to + 30;
        from = from - 30;
      }
      query.andWhere(`((event.startTimeI IS NULL AND event.endTimeI IS NULL) OR
      (event.endTimeI IS NULL AND event.startTimeI < ${to} AND event.startTimeI > ${from}) OR
      (event.startTimeI < ${to} AND event.endTimeI > ${from}))`);
    }

    if (filter.activeDays && !filter.dates) {
      this.weekDayQuery(query, filter.activeDays);
    }

    if (filter.dates) {
      this.byDates(query, filter.dates);
    }

    const end = new Date(filter.activeDay);
    end.setMonth(end.getMonth() + 1);
    query.andWhere(`(event.startDate > '${filter.activeDay}' AND event.startDate < '${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}')`);

    query.addOrderBy('event.startDate', 'ASC');
    query.addOrderBy('event.startTime', 'ASC', 'NULLS FIRST');

    const events = await query.getMany();
    if (events.length) {
      const fullEvent = await this.find({id: In(events.map(e => e.id))}, option);
      return {
        end: `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`,
        events: events.map(e => fullEvent.find(fe => e.id === fe.id)),
      };
    }

    return {
      end: `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`,
      events: [],
    };
  }
  async update(eventPath: EventUpdateDto, event: Event, user: User): Promise<Event> {
    return await getManager().transaction(async transactionalEntityManager => {
      try {
        for (let key in eventPath) {
          if (eventPath[key] === undefined) {
            delete eventPath[key];
          }
        }

        if (eventPath.startDate) {
          eventPath.startDate = DateTime.fromJSDate(new Date(eventPath.startDate)).toISO();
        } else {
          if (eventPath.hasOwnProperty('startDate')) {
            eventPath.startDate = null;
          }
        }
        if (eventPath.endDate) {
          eventPath.endDate = DateTime.fromJSDate(new Date(eventPath.endDate)).toISO();
        } else {
          if (eventPath.hasOwnProperty('endDate')) {
            eventPath.endDate = null;
          }
        }
        let newPostCode = event.postcode;
        if (eventPath.hasOwnProperty('startTime')) {
          eventPath.startTimeI = strTimeToNumber(eventPath.startTime);
        }
        if (eventPath.hasOwnProperty('endTime')) {
          eventPath.endTimeI = strTimeToNumber(eventPath.endTime);
        }
        if (eventPath.postcode) {
          newPostCode = await this.postcode.findOrCreate(eventPath.postcode, transactionalEntityManager);
        } else if (eventPath.postcode === '') {
          newPostCode = null;
        }

        await transactionalEntityManager.save(Event, new Event({
          ...eventPath,
          ...event,
          postcode: newPostCode,
        }), {});
        return transactionalEntityManager.findOne(Event, eventPath.id, {relations: this.relations});
      } catch (err) {
            HttpErrorHelper.checkDataBaseError(err);
            throw err;
      }
    });
  }


  async search(coordinates: [number, number], radius: number, categories: number[], time: string, option: EventQuerySetting = {}) {
    const where: any = {}

    const query = this.eventRepository.createQueryBuilder('event')
      .select()
      .leftJoin('event.postcode', 'postcode_event')
      .leftJoin('event.owner', 'owner')
      .leftJoin('event.organisation', 'org')
      .leftJoin('event.category', 'category')
      .where('event.deleted_date IS NULL')
      .andWhere('event.startDate > NOW()');

    if (coordinates) {
      const postcodeIds = (await this.postcode.searchNear(coordinates, radius)).map(p => p.id);
      postcodeIds.push(0);
      query.andWhere(`
        CASE
          WHEN "postcode_event"."id" is not NULL THEN "postcode_event"."id"
          WHEN "org"."postcode_id" is not NULL THEN "org"."postcode_id"
          WHEN "owner"."postcode_id" is not NULL THEN "owner"."postcode_id"
        END IN (:...postcodeIds)`, {postcodeIds});
    }

    if (categories && categories.length) {
      query.andWhere(`category.id IN (:...categories)`, {categories});
    }

    if (time) {
      const now = new Date();
      const end =  new Date();
      switch (time) {
        case 'today':
          const today = new Date();
          today.setDate(today.getDate() + 1);
          query.andWhere(`"event"."startDate" BETWEEN
            DATE('${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}') AND
            DATE('${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}') - '1 minute'::interval`);
          break;
        case 'in_the_week':
          const week = new Date();
          week.setDate(week.getDate() + 7);
          query.andWhere(`"event"."startDate" BETWEEN
            DATE('${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}') AND
            DATE('${week.getFullYear()}-${week.getMonth() + 1}-${week.getDate()}') - '1 minute'::interval`);
          break;
        case 'this_week':
            const startWeek = new Date();
            startWeek.setDate(startWeek.getDate() - startWeek.getDay());
            const endWeek = new Date();
            endWeek.setDate(endWeek.getDate() + 7 - endWeek.getDay());
            query.andWhere(`"event"."startDate" BETWEEN
              DATE('${startWeek.getFullYear()}-${startWeek.getMonth() + 1}-${startWeek.getDate()}') AND
              DATE('${endWeek.getFullYear()}-${endWeek.getMonth() + 1}-${endWeek.getDate()}') - '1 minute'::interval`);
            break;
        case 'bank_holidays':
          query.andWhere(this.holidaysQuery());
          break;
        case 'weekends':
          if (now.getDay() === 0) {
            now.setDate(now.getDate() + 6 - now.getDay());
            end.setDate(end.getDate() + 8 - end.getDay());
          } else {
            now.setDate(now.getDate() - 1);
            end.setDate(end.getDate() + 1);
          }
          query.andWhere(`"event"."startDate" BETWEEN
            DATE('${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}') AND
            DATE('${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}') - '1 minute'::interval`);
          break;
          break;
        case 'school_holidays':
          query.andWhere(`(${this.getScoolHolidays()})`);
          break;
      }
    }

    const events = await query.getMany();
    if (events.length) {
      return this.find({id: In(events.map(e => e.id))}, option);
    }
    return [];
  }

  holidaysQuery() {
    let month = (new Date()).getMonth() + 1;
    let year = (new Date()).getFullYear();
    let where = [];
    let monthY = 12;
    while (monthY > 1) {
      if (HOLIDAYS[month]) {
        where = [...where, ...HOLIDAYS[month].map(d => this.generateToDay(d, month, year))];
      }
      monthY--;
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }
    return `( ${where.join(' OR ')} )`;
  }

  generateToDay(day, month, year) {
    const date = `${year}-${month}-${day}`;
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const where = `("event"."startDate" BETWEEN
     DATE('${date}') AND DATE('${next.getFullYear()}-${next.getMonth() + 1}-${next.getDate()}') - '1 minute'::interval
    )`;
    return where;
  }

  getScoolHolidays() {
    const start = new Date();
    const endDate = new Date(`${start.getFullYear() + 1}-${start.getMonth() + 1}-${start.getDate()}`);
    const where = [];
    let d1: Date;
    let d2: Date;
    let holiday;
    while (endDate > start) {
      const week = this.ISO8601_week_no(start);
      if (!holiday) {
        holiday = schoolHoliday.find(d => d.start === week || d.end === week );
      }
      if (holiday && holiday.start === week) {
        d1 = new Date(start);
        if (week >= 29 && week < 35) {
          const summerH = new Date(`${d1.getFullYear()}-07-15`);
          d1 = (summerH > d1) ? summerH : d1;
        }
      }
      if (holiday && holiday.end === week) {
        if (!d1) {
          d1 = new Date(start);
        }
        start.setDate(start.getDate() + 6 - start.getDay());
        d2 = new Date(start);
        if (start > endDate) {
          d2 = endDate;
        }
        if (week > 29 && week <= 35) {
          const summerH = new Date(`${d2.getFullYear()}-09-1`);
          d2 = (summerH < endDate) ? summerH : d2;
        }
        holiday = null;
      }
      if (d1 && d2) {
        where.push(`("event"."startDate" BETWEEN
          DATE('${d1.getFullYear()}-${d1.getMonth() + 1}-${d1.getDate()}') AND
          DATE('${d2.getFullYear()}-${d2.getMonth() + 1}-${d2.getDate()}') - '1 minute'::interval
        )`);
        d1 = null;
        d2 = null;
      }
      if (start.getDay() === 0) {
        start.setDate(start.getDate() + 1);
      } else {
        start.setDate(start.getDate() + 8 - start.getDay());
      }
    }
    return where.join(' OR ');
  }

  ISO8601_week_no(dt) {
    const tdt: any = new Date(dt.valueOf());
    const dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    const firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
        tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
  }

  async delete(id: number, recurring: Recurring) {
    let where: any;
    if(recurring) {
      await this.recurring.delete(recurring.id);
      where = { recurring };
    } else {
      where = { id };
    }
    return this.eventRepository.update(where, {deletedDate: new Date()});
  }

  async assignEventToGroup(event_id: number, group_id: number) {
    await  this.eventRepository.createQueryBuilder()
      .insert()
      .into('event_groups')
      .values([{event_id, group_id}])
      .onConflict(` DO NOTHING`)
      .execute();
  }

  async getEducationCategories(country: string) {
    const query = await this.schoolyearRepository.createQueryBuilder('schoolyear')
      .select()
      .leftJoin('schoolyear.country', 'country')
      .where(`country.country = '${country}'`);
    return await query.getMany();
  }
}
