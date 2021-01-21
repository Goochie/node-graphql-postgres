import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ThemeImagesOut {
  @Field({nullable: true})
  id: number;

  @Field()
  key: string;

  @Field()
  url: string;
}
