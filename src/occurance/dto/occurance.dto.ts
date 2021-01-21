import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class OccuranceOut {
  @Field(() => Int, {nullable: true})
  id?: number;

  @Field()
  name: string;

  @Field(() => Int, {nullable: true})
  parent: string;
}
