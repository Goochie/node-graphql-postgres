import { ObjectType, Field } from 'type-graphql';
import { ThemeImagesOut } from '../../theme-images/dto/theme-images.dto';

@ObjectType()
export class TopFund {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field({nullable: true})
  photoUrl?: string;

  @Field({nullable: true})
  followed: boolean;

  @Field()
  total: number;

  @Field({nullable: true})
  theme?: ThemeImagesOut;
}
