import { Field, ObjectType } from 'type-graphql';
import { Fund } from '../../fund/fund.entity';
import { FundDto } from '../../fund/dto/fund.dto';
import { Event } from '../event.entity';
import { EventDto } from './event.dto';

@ObjectType()
export class SmartCalendarResult {
  @Field({nullable: true})
  end: string;

  @Field(() => [EventDto], {nullable: true})
  events: Event[];
}
