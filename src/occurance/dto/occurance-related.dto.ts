import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class OccuranceRelated {
  @Field(() => Int)
  id: number;

  @Field({nullable: true})
  name?: string;

  @Field(() => Int, {nullable: true})
  parent?: number;
}
