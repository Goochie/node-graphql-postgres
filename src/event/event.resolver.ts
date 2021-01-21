import { Resolver, Args, Mutation, Context, Query } from '@nestjs/graphql';
import { EventService } from './event.service';
import { Int, Float } from 'type-graphql';
import { DateTime } from 'luxon';
import { UseGuards, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { EventDto } from './dto/event.dto';
import { EventInputDto } from './dto/event-input.dto';
import { FromContextPipe } from '../common/from-context.pipe';
import { User } from '../user/user.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FileService } from '../common/services/file/file.service';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { OptionalJwtGuard } from '../common/guards/jwt-optyonal.guard';
import { HTTP_ERROR_YOU_OWNER_EVENT, HTTP_ERROR_EVENT_GROUP_NOT_FOUND } from '../common/helpers/http-error-helper';
import { HTTP_ERROR_EVENT_NOT_FOUND } from '../common/helpers/http-error-helper';
import { UserOut } from '../user/dto/user.out';
import { SmartCalendarFilter } from './dto/smart-calendar.input';
import { SmartCalendarResult } from './dto/smart-calendar.out';
import { EventUpdateDto } from './dto/event-update.dto';
import { MoreThanOrEqual, MoreThan, LessThan, Raw } from 'typeorm';
import { EventGroupOut } from './dto/event-group.dto';
import { EventGroupInputDto } from './dto/event-group-input.dto';
import { EventGroupUpdateDto } from './dto/event-group-update.dto';
import { SchoolyearOut } from '../common/school-year/dto/school-year.dto';

@Resolver('Event')
export class EventResolver {

  constructor(private readonly eventSrv: EventService, private readonly fileSrv: FileService) {

  }

  @Query(() => [EventDto])
  @UseGuards(JwtGuard)
  async getMyEvents(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Boolean, name: 'fromNow', nullable: true}) fromNow: boolean,
    @Args({type: () => String, name: 'type', nullable: true}) type: string,
    @Args({type: () => String, name: 'order', nullable: true}) order: string,
  ) {
    const where: any[] = [{owner: {id: user.id}}, {event_followers: user.id}];
    if (fromNow) {
      let now: Date|string = new Date();
      now = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      where.forEach(cond => {
        cond.startDate = MoreThanOrEqual(now);
      });
    }
    if(type == 'private') {
      where.forEach(cond => {
        cond.isPublic = false;
      });
    }
    if(type == 'public') {
      where.forEach(cond => {
        cond.isPublic = true;
      });
    }
    if(type == 'paying') {
      where.forEach(cond => {
        cond.cost = MoreThan(0);
      });
    }
    if(type == 'free') {
      where.forEach(cond => {
        cond.cost = Raw(cost => `(${cost} = 0 OR ${cost} IS NULL)`);
      });
    }
    if(type == 'active') {
      let now: Date|string = new Date();
      now = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      where.forEach(cond => {
        cond.startDate = MoreThanOrEqual(now);
      });
    }
    if(type == 'deactive') {
      let now: Date|string = new Date();
      now = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      where.forEach(cond => {
        cond.startDate = LessThan(now);
      });
    }
    const events = (await this.eventSrv.find(where, {isIFollow: user.id,  order}));

    return events;
  }

  @Query(() => [EventGroupOut])
  @UseGuards(JwtGuard)
  async getEventGroups(
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    return await this.eventSrv.getGroups(user.id);
  }

  @Mutation(() => EventGroupOut)
  @UseGuards(JwtGuard)
  async createEventGroup(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => GraphQLUpload, name: 'upload', nullable: true}) file: FileUpload,
    @Args('input') input: EventGroupInputDto,
  ) {
    let s3file: ManagedUpload.SendData;
    if (file) {
      s3file = await this.fileSrv.fileUpload(file, `event_group/${Date.now()}/`);
      input.photoUrl = s3file.Location;
    }
    return this.eventSrv.createGroup(input, user);
  }

  @Mutation(() => EventGroupOut)
  @UseGuards(JwtGuard)
  async updateEventGroup (
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({type: () => GraphQLUpload, name: 'upload', nullable: true}) file: FileUpload,
      @Args('input') input: EventGroupUpdateDto,
  ) {
      const group = (await this.eventSrv.findGroup({id: input.id}))[0];
      if (!group) {
        throw new NotFoundException(HTTP_ERROR_EVENT_GROUP_NOT_FOUND);
      }
      if (group.owner.id !== user.id) {
        throw new ForbiddenException();
      }
      let s3file: ManagedUpload.SendData;
      const oldFile = group.photoUrl;
      if (file) {
        s3file = await this.fileSrv.fileUpload(file, `event/${Date.now()}/`);
        input.photoUrl = s3file.Location;
      }
      delete input.id;
      const result = await this.eventSrv.updateGroup(input, group, user);
      if (oldFile) {
        try {
          const parts = (oldFile || '').split('/');
          await this.fileSrv.deleteFile(parts.slice(parts.length - 3).join('/'));
        } catch (e) {
          console.log(e)
        }
      }
      return result;
  }
  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async deleteEventGroup(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const group = (await this.eventSrv.findGroup({id}))[0];
    if (!group) {
      throw new NotFoundException(HTTP_ERROR_EVENT_GROUP_NOT_FOUND);
    }
    if (group.owner.id !== user.id) {
      throw new ForbiddenException();
    }
    await this.eventSrv.deleteGroup(id);
    return 'OK';
  }
  @Mutation(() => EventGroupOut)
  @UseGuards(JwtGuard)
  async cloneEventGroup(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const group = (await this.eventSrv.findGroup({id}))[0];
    if (!group) {
      throw new NotFoundException(HTTP_ERROR_EVENT_GROUP_NOT_FOUND);
    }
    if (group.owner.id !== user.id) {
      throw new ForbiddenException();
    }
    return await this.eventSrv.cloneGroup(id);
  }

  @Query(() => EventDto)
  @UseGuards(OptionalJwtGuard)
  async getEvent(@Context(new FromContextPipe('req.user')) user: User, @Args({type: () => Int, name: 'id'}) id: number) {
    const event = (await this.eventSrv.find({id}, {isIFollow: (user) ? user.id : null}))[0];
    if (!event) {
      throw new NotFoundException(HTTP_ERROR_EVENT_NOT_FOUND);
    }
    return event;
  }

  @Query(() => EventDto)
  @UseGuards(OptionalJwtGuard)
  async getEventAgeGroup(@Context(new FromContextPipe('req.user')) user: User, @Args({type: () => Int, name: 'id'}) id: number) {
    const event = (await this.eventSrv.find({id}, {isIFollow: (user) ? user.id : null}))[0];
    if (!event) {
      throw new NotFoundException(HTTP_ERROR_EVENT_NOT_FOUND);
    }
    const response = {
      minAge: event.minAge || 0,
      maxAge: event.maxAge || 0
    };
    return response;
  }

  @Query(() => [EventDto])
  @UseGuards(OptionalJwtGuard)
  async getEventForOrg(@Context(new FromContextPipe('req.user')) user: User, @Args({type: () => Int, name: 'id'}) id: number) {
    const events = (await this.eventSrv.find({organisation_id: id}, {isIFollow: (user) ? user.id : null}));
    return events;
  }

  @Query(() => [EventDto])
  @UseGuards(OptionalJwtGuard)
  async getEventForCommunity(@Context(new FromContextPipe('req.user')) user: User, @Args({type: () => String, name: 'id'}) id: string) {
    const events = (await this.eventSrv.getEventForCommunity(id, {isIFollow: (user) ? user.id : null}));
    return events;
  }

  @Query(() => [EventDto])
  @UseGuards(OptionalJwtGuard)
  async getPopularEventsForCommunity(
    @Context(new FromContextPipe('req.user')) user: User, 
    @Args({type: () => String, name: 'id'}) id: string
  ) {
    const events = (await this.eventSrv.getPopularEventsForCommunity(id, {isIFollow: (user) ? user.id : null}));
    return events;
  }

  @Query(() => [UserOut])
  @UseGuards(JwtGuard)
  async getEventGoing(@Context(new FromContextPipe('req.user')) user: User, @Args({type: () => Int, name: 'id'}) id: number) {
    return this.eventSrv.getGoing(id, user.id);
  }

  @Query(() => [EventDto])
  @UseGuards(OptionalJwtGuard)
  async searchEvent(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => [Float, Float], name: 'coordinates', nullable: true}) coordinates: [number, number],
    @Args({type: () => Float, name: 'radius', nullable: true}) radius: number,
    @Args({type: () => [Int], name: 'categories', nullable: true}) categories: number[],
    @Args({type: () => String, name: 'time', nullable: true}) time: string,
  ) {
    return this.eventSrv.search(coordinates, radius, categories, time, {isIFollow: (user) ? user.id : null, order: 'date'});
  }

  @Query(() => SmartCalendarResult)
  @UseGuards(OptionalJwtGuard)
  async smartCalendar(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => SmartCalendarFilter, name: 'filter', nullable: true}) filter: SmartCalendarFilter,
  ) {
    return this.eventSrv.smartCalendar(filter, user, {isIFollow: (user) ? user.id : null});
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async followEvent(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const event = (await this.eventSrv.find({id}))[0];
    if (!event) {
      throw new NotFoundException(HTTP_ERROR_EVENT_NOT_FOUND);
    }
    if (event.owner.id === user.id) {
      throw new BadRequestException(HTTP_ERROR_YOU_OWNER_EVENT);
    }
    await this.eventSrv.follow(id, user, event);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async unfollowEvent(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const event = (await this.eventSrv.find({id}))[0];
    if (!event) {
      throw new NotFoundException(HTTP_ERROR_EVENT_NOT_FOUND);
    }
    if (event.owner.id === user.id) {
      throw new BadRequestException(HTTP_ERROR_YOU_OWNER_EVENT);
    }
    await this.eventSrv.unfollow(id, user, event);
    return 'OK';
  }

  @Mutation(() => EventDto)
  @UseGuards(JwtGuard)
  async createEvent(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => GraphQLUpload, name: 'upload', nullable: true}) file: FileUpload,
    @Args('input') input: EventInputDto,
  ) {
    let s3file: ManagedUpload.SendData;
    if (file) {
      s3file = await this.fileSrv.fileUpload(file, `event/${Date.now()}/`);
      input.photoUrl = s3file.Location;
    }
    return this.eventSrv.create(input, user);
  }

  @Mutation(() => EventDto)
  @UseGuards(JwtGuard)
  async updateEvent (
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({type: () => GraphQLUpload, name: 'upload', nullable: true}) file: FileUpload,
      @Args('input') input: EventUpdateDto,
  ) {
      const event = (await this.eventSrv.find({id: input.id}))[0];
      if (!event) {
        throw new NotFoundException(HTTP_ERROR_EVENT_NOT_FOUND);
      }
      if (event.owner.id !== user.id) {
        throw new ForbiddenException();
      }
      let s3file: ManagedUpload.SendData;
      const oldFile = event.photoUrl;
      if (file) {
        s3file = await this.fileSrv.fileUpload(file, `event/${Date.now()}/`);
        input.photoUrl = s3file.Location;
      }
      await this.eventSrv.delete(event.id, event.recurring);
      delete input.id;
      const result = await this.eventSrv.create(new EventInputDto({
        ...input
      }), user);
      if (oldFile) {
        try {
          const parts = (oldFile || '').split('/');
          await this.fileSrv.deleteFile(parts.slice(parts.length - 3).join('/'));
        } catch (e) {
          console.log(e)
        }
      }
      return result;
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async deleteEvent(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const event = (await this.eventSrv.find({id}))[0];
    if (!event) {
      throw new NotFoundException(HTTP_ERROR_EVENT_NOT_FOUND);
    }
    if (event.owner.id !== user.id) {
      throw new ForbiddenException();
    }
    await this.eventSrv.delete(id, event.recurring);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async deleteEventBatch(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => [Int], name: 'ids'}) ids: number[],
  ) {
    for(let i = 0; i < ids.length; i ++) {
      const id = ids[i];
      const event = (await this.eventSrv.find({id}))[0];
      if (!event) {
        throw new NotFoundException(HTTP_ERROR_EVENT_NOT_FOUND);
      }
      if (event.owner.id !== user.id) {
        throw new ForbiddenException();
      }
      await this.eventSrv.delete(id, event.recurring);
    }
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async assignEventToGroup(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'event_id'}) event_id: number,
    @Args({type: () => Int, name: 'group_id'}) group_id: number,
  ) {
    const event = (await this.eventSrv.find({event_id}))[0];
    if (!event) {
      throw new NotFoundException(HTTP_ERROR_EVENT_NOT_FOUND);
    }
    if (event.owner.id !== user.id) {
      throw new ForbiddenException();
    }
    await this.eventSrv.assignEventToGroup(event_id, group_id);
    return "OK";
  }

  @Mutation(() => EventDto)
  @UseGuards(JwtGuard)
  async cloneEvent(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const event = (await this.eventSrv.find({id}))[0];
    if (!event) {
      throw new NotFoundException(HTTP_ERROR_EVENT_NOT_FOUND);
    }
    if (event.owner.id !== user.id) {
      throw new ForbiddenException();
    }
    delete event.id;
    return await this.eventSrv.create(new EventInputDto({
      title : event.title, description: event.description,
      postcode: event.postcode ? event.postcode.postcode : '', location: event.location, isOnline: event.isOnline,
      organisation_id: event.organisation_id, isPublic: event.isPublic,
      category: event.category ? event.category.map(x => ({id: x.id})) : [], schoolYear: event.schoolYear,
      theme: event.theme, photoUrl: event.photoUrl,
      startDate: DateTime.fromJSDate(event.startDate).toISO(), startTime: event.startTime,
      endDate: event.endDate ? DateTime.fromJSDate(event.endDate).toISO() : null, endTime: event.endTime,
      assign: event.assign ? {id: event.assign.id} : null,
      cost: event.cost, contribution: event.contribution, size: event.size,
      groups: event.groups ? event.groups.map(x => ({id: x.id})) : [],
      minAge: event.minAge, maxAge: event.maxAge,
      recurring: !!event.recurring, recurring_info: event.recurring,
      documents: event.documents
    }), user);
  }
  
  @Query(() => [SchoolyearOut])
  @UseGuards(JwtGuard)
  async getEducationCategories(
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    return (await this.eventSrv.getEducationCategories('ENGLAND'));
  }
}
