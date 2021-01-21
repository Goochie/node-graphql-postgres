import { InputType, Field, Int } from 'type-graphql';
import { CategoryRelated } from '../../categories/dto/category-related.dto';
import { ThemeImagesRelated } from '../../theme-images/dto/theme-images-related.dto';

@InputType()
export class FundUpdateDto {
  @Field()
  id: number;

  @Field({nullable: true})
  title?: string;

  @Field({nullable: true})
  description?: string;

  @Field(() => [CategoryRelated], {nullable: true})
  category?: CategoryRelated[];

  @Field({nullable: true})
  theme?: ThemeImagesRelated;

  @Field({nullable: true})
  photoUrl?: string;

  @Field({nullable: true})
  location?: string;

  @Field({nullable: true})
  isPublic?: boolean;

  @Field({nullable: true})
  startDate?: string;

  @Field({nullable: true})
  endDate: string;

  @Field({nullable: true})
  isPublished?: boolean;

  @Field(() => Int, {nullable: true})
  organisation_id?: number;

  @Field({nullable: true})
  amount?: number;

  @Field({nullable: true})
  thankTitle: string;

  @Field({nullable: true})
  thankMessage: string;
}
