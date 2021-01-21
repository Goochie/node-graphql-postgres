import { ObjectType, Field, Int } from 'type-graphql';
import { CategoryOut } from '../../categories/dto/category.dto';
import { ThemeImagesOut } from '../../theme-images/dto/theme-images.dto';
import { PostCodeOut } from '../../postcode/dto/post-code';
import { UserOut } from '../../user/dto/user.out';
import { EventGroupOut } from './event-group.dto';
import { RecurringOut } from '../../recurring/dto/recurring';
import { SchoolyearOut } from '../../common/school-year/dto/school-year.dto';
import { EventDocumentOut } from '../../event-document/dto/event-document.dto';

@ObjectType()
export class EventDto {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field({nullable: true})
  postcode: PostCodeOut;

  @Field(() => Int, {nullable: true })
  organisation_id: number;

  @Field(() => [CategoryOut], {nullable: true })
  category: CategoryOut[];

  @Field({nullable: true})
  schoolYear: SchoolyearOut;

  @Field({nullable: true})
  theme?: ThemeImagesOut;

  @Field({nullable: true})
  photoUrl?: string;

  @Field({nullable: true})
  followed: boolean;

  @Field({nullable: true})
  follower_count: number;

  @Field({nullable: true})
  updates_count: number;

  @Field({nullable: true})
  owner: UserOut;

  @Field()
  createdDate: Date;

  @Field()
  updatedDate: Date;

  @Field()
  isPublic: boolean;

  @Field({nullable: true})
  location: string;

  @Field()
  isOnline: boolean;

  @Field()
  startDate: string;

  @Field({nullable: true})
  startTime: string;

  @Field({nullable: true})
  endDate: string;

  @Field({nullable: true})
  endTime: string;

  @Field({nullable: true})
  assign: UserOut;

  @Field({nullable: true})
  cost: number;

  @Field({nullable: true})
  contribution: number;

  @Field({nullable: true})
  size: number;

  @Field(() => [EventGroupOut], {nullable: true})
  groups?: [EventGroupOut];

  @Field({nullable: true})
  minAge: number;

  @Field({nullable: true})
  maxAge: number;

  @Field(() => RecurringOut, {nullable: true})
  recurring: RecurringOut;

  @Field(() => [EventDocumentOut], {nullable: true })
  documents: EventDocumentOut[];
}
