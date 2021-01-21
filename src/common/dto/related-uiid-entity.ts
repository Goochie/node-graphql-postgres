import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class RelatedUiid {
  @Field()
  id: string;
}
