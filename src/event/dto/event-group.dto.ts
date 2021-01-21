import { ObjectType, Field, Int } from 'type-graphql';
import { PostCodeOut } from '../../postcode/dto/post-code';
import { UserOut } from '../../user/dto/user.out';
import { CategoryOut } from '../../categories/dto/category.dto';
import { ThemeImagesOut } from '../../theme-images/dto/theme-images.dto';
import { EventRelatedDto } from './event-related.dto';

@ObjectType()
export class EventGroupOut {
  @Field({nullable: true})
  id: number;

  @Field({nullable: true})
  title: string;

  @Field({nullable: true})
  description: string;

  @Field({nullable: true})
  postcode: PostCodeOut;

  @Field({nullable: true})
  owner: UserOut;

  @Field(() => Int, {nullable: true })
  organisation_id: number;

  @Field(() => [CategoryOut], {nullable: true })
  category: CategoryOut[];

  @Field({nullable: true})
  theme?: ThemeImagesOut;

  @Field({nullable: true})
  photoUrl?: string;

  @Field({nullable: true})
  assign: UserOut;

  @Field({nullable: true})
  cost: number;

  @Field({nullable: true})
  seats: number;

  @Field(() => [EventRelatedDto], {nullable: true})
  events?: EventRelatedDto[];

  @Field()
  createdDate: Date;

  @Field()
  updatedDate: Date;

}