import { Field, InputType } from 'type-graphql';

@InputType()
export class ThemeImagesRelated {
  @Field()
  id: number;

  @Field({nullable: true})
  key?: string;

  @Field({nullable: true})
  url?: string;
}
