import { User } from '../user.entity';
import { UserOut } from './user.out';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PublicProfile extends UserOut {
  @Field({nullable: true})
  followed: boolean;
  @Field({nullable: true})
  followersCnt: number;
  @Field({nullable: true})
  followingCnt: number;
}
