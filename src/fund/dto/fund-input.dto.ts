import { InputType, Field, Int } from 'type-graphql';
import { CategoryRelated } from '../../categories/dto/category-related.dto';
import { ThemeImagesRelated } from '../../theme-images/dto/theme-images-related.dto';

@InputType()
export class FundInputDto {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [CategoryRelated])
  category: CategoryRelated[];

  @Field({nullable: true})
  theme?: ThemeImagesRelated;

  @Field({nullable: true})
  photoUrl?: string;

  @Field({nullable: true})
  location: string;

  @Field()
  isPublic: boolean;

  @Field()
  startDate: string;

  @Field({nullable: true})
  endDate: string;

  @Field()
  isPublished: boolean;

  @Field(() => Int, {nullable: true})
  organisation_id: number;

  @Field()
  payout: boolean;

  @Field()
  amount: number;

  @Field({nullable: true})
  thankTitle: string;

  @Field({nullable: true})
  thankMessage: string;
}
