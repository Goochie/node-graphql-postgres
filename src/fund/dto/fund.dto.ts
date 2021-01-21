import { ObjectType, Field, Int } from 'type-graphql';
import { CategoryOut } from '../../categories/dto/category.dto';
import { ThemeImagesOut } from '../../theme-images/dto/theme-images.dto';
import { UserOut } from '../../user/dto/user.out';

@ObjectType()
export class FundDto {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [CategoryOut], {nullable: true })
  category: CategoryOut[];

  @Field({nullable: true})
  theme?: ThemeImagesOut;

  @Field({nullable: true})
  photoUrl?: string;

  @Field({nullable: true})
  followed: boolean;

  @Field({nullable: true})
  voted: boolean;

  @Field({nullable: true})
  owner: UserOut;

  @Field()
  createdDate: Date;

  @Field()
  updatedDate: Date;

  @Field()
  isPublic: boolean;

  @Field()
  startDate: string;

  @Field({nullable: true})
  endDate: string;

  @Field()
  isPublished: boolean;

  @Field({nullable: true})
  thankTitle: string;

  @Field({nullable: true})
  thankMessage: string;

  @Field(() => Int, {nullable: true})
  organisation_id: number;

  @Field()
  amount: number;

  @Field({nullable: true})
  raised: number;

  @Field()
  payout: boolean;

  @Field({nullable: true})
  follower_count: number;

  @Field({nullable: true})
  updates_count: number;

  @Field({nullable: true})
  vote_count: number;
}
