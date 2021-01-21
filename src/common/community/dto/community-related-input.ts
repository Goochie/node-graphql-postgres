import { InputType, Field } from 'type-graphql';

@InputType()
export class CommunityRelated {
  @Field()
  community_id: string;
}