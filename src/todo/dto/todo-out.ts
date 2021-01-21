import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class TodoOut {
  @Field()
  id: string;

  @Field()
  type: string;

  @Field()
  text: string;
}
