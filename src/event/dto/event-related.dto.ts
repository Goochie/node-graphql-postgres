import { ObjectType, Field } from 'type-graphql';
import { ThemeImagesOut } from '../../theme-images/dto/theme-images.dto';

@ObjectType()
export class EventRelatedDto {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field({nullable: true})
  theme?: ThemeImagesOut;

  @Field({nullable: true})
  photoUrl?: string;

  @Field()
  startDate: string;

  @Field({nullable: true})
  startTime: string;

  @Field({nullable: true})
  endDate: string;

  @Field({nullable: true})
  endTime: string;
}
