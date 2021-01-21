import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class SocialUser {
  @Field()
  id?: string;

  @Field()
  username: string;

  @Field()
  email?: string;

  @Field()
  photoUrl?: string;
}
