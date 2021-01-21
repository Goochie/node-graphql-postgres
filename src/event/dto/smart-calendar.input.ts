import { Related } from '../../common/dto/related-entity';
import { InputType, Field, Float } from 'type-graphql';
/* tslint:disable:max-classes-per-file */
@InputType()
export class WeekDays {
  @Field()
  mo: boolean;

  @Field()
  tu: boolean;

  @Field()
  we: boolean;

  @Field()
  th: boolean;

  @Field()
  fr: boolean;

  @Field()
  sa: boolean;

  @Field()
  su: boolean;
}

export const daysOfWeek = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']

@InputType()
export class SmartCalendarFilter {
  @Field({nullable: true})
  from: string;

  @Field({nullable: true})
  to: string;

  @Field(() => [Related], {nullable: true})
  category: Related[];

  @Field(() => [Float, Float], {nullable: true})
  coordinates: [number, number];

  @Field({nullable: true})
  radius: number;

  @Field({nullable: true})
  plusTime: boolean;

  @Field(() => [String], {nullable: true})
  dates: string[];

  @Field(() => WeekDays, {nullable: true})
  activeDays: WeekDays;

  @Field({nullable: true})
  activeDay: string;

  @Field({nullable: true})
  forMe: boolean;
}
