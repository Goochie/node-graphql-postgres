import { InputType, Field, Int } from 'type-graphql';
import { CategoryRelated } from '../../categories/dto/category-related.dto';
import { ThemeImagesRelated } from '../../theme-images/dto/theme-images-related.dto';
import { Related } from '../../common/dto/related-entity';
import { RecurringInputDto } from '../../recurring/dto/recurring-input.dto';
import { DeepPartial } from 'typeorm';
import { EventDocumentRelated } from '../../event-document/dto/theme-images-related.dto';

@InputType()
export class EventInputDto {
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
  schoolYear: Related;

  @Field({nullable: true})
  theme?: ThemeImagesRelated;

  @Field({nullable: true})
  photoUrl?: string;

  @Field({nullable: true})
  location: string;

  @Field()
  isOnline: boolean;

  @Field()
  isPublic: boolean;

  @Field()
  startDate: string;

  @Field({nullable: true})
  startTime: string;

  @Field({nullable: true})
  endDate: string;

  @Field({nullable: true})
  endTime: string;

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
  
  @Field(() => [EventDocumentRelated])
  documents: EventDocumentRelated[];
  
  constructor(partial: DeepPartial<EventInputDto>) {
    for (const key in partial) {
      if (partial.hasOwnProperty(key)) {
        this[key] = partial[key];
      }
    }
  }
}
