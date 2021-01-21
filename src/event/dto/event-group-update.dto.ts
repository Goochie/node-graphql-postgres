import { InputType, Field, Int } from 'type-graphql';
import { CategoryRelated } from '../../categories/dto/category-related.dto';
import { ThemeImagesRelated } from '../../theme-images/dto/theme-images-related.dto';
import { Related } from '../../common/dto/related-entity';

@InputType()
export class EventGroupUpdateDto {
  @Field()
  id: number;
  
  @Field()
  title: string;

  @Field()
  description: string;

  @Field({nullable: true})
  postcode: string;

  @Field(() => Int, {nullable: true })
  organisation_id: number;

  @Field(() => [CategoryRelated])
  category: CategoryRelated[];

  @Field({nullable: true})
  theme?: ThemeImagesRelated;

  @Field({nullable: true})
  photoUrl?: string;

  @Field({nullable: true})
  location: string;

  @Field({nullable: true})
  assign: Related;

  @Field({nullable: true})
  cost: number;

  @Field({nullable: true})
  seats: number;

  @Field(() => [Related])
  events: Related[];
}
