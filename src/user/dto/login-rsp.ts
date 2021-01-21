import { ObjectType, Field } from 'type-graphql';
import { MeOut } from './user.out';

@ObjectType()
export class LoginResponce {
  @Field()
  user: MeOut;

  @Field()
  token: string;
}
