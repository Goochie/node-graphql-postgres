import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class Related {
  @Field(() => Int)
  id: number;
}
