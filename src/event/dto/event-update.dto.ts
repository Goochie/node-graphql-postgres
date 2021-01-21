import { InputType, Field, Int } from 'type-graphql';
import { CategoryRelated } from '../../categories/dto/category-related.dto';
import { ThemeImagesRelated } from '../../theme-images/dto/theme-images-related.dto';
import { Related } from '../../common/dto/related-entity';
import { RecurringInputDto } from '../../recurring/dto/recurring-input.dto';
import { EventGroup } from '../event-group.entity';
import { EventDocumentRelated } from '../../event-document/dto/theme-images-related.dto';

@InputType()
export class EventUpdateDto {
  @Field()
  id: number;

  @Field({nullable: true})
  title?: string;

  @Field({nullable: true})
  description?: string;

  @Field({nullable: true})
  postcode?: string;

  @Field(() => Int, {nullable: true })
  organisation_id?: number;

  @Field(() => [CategoryRelated], {nullable: true})
  category?: CategoryRelated[];

  @Field({nullable: true})
  schoolYear: Related;

  @Field({nullable: true})
  theme?: ThemeImagesRelated;

  @Field({nullable: true})
  photoUrl?: string;

  @Field({nullable: true})
  location?: string;

  @Field({nullable: true})
  isOnline?: boolean;

  @Field({nullable: true})
  isPublic?: boolean;

  @Field({nullable: true})
  startDate?: string;

  @Field({nullable: true})
  startTime?: string;

  @Field({nullable: true})
  endDate?: string;

  @Field({nullable: true})
  endTime?: string;

  startTimeI: number;
  endTimeI: number;

  @Field({nullable: true})
  assign: Related;

  @Field({nullable: true})
  cost: number;

  @Field({nullable: true})
  contribution: number;

  @Field({nullable: true})
  size: number;

  @Field(() => [Related])
  groups: Related[];

  @Field({nullable: true})
  minAge: number;

  @Field({nullable: true})
  maxAge: number;

  @Field()
  recurring: boolean;

  @Field({nullable: true})
  recurring_info: RecurringInputDto;

  @Field(() => [EventDocumentRelated], {nullable: true})
  documents?: EventDocumentRelated[];
}
