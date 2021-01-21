import { ObjectType, Field } from 'type-graphql';
import { DeepPartial } from 'typeorm';
import { PostCodeOut } from '../../postcode/dto/post-code';
import { UserSavingOut } from './saving';



@ObjectType()
export class UserOut {
    @Field()
    id: number;

    @Field()
    username: string;

    @Field()
    email: string;

    @Field({nullable: true})
    mobile?: string;

    @Field({nullable: true})
    postcode?: PostCodeOut;

    @Field({nullable: true})
    photoUrl?: string;

    @Field(type => [String], {nullable: true})
    compliteTodo?: string[];

    @Field({nullable: true})
    orgTodo?: boolean;

    @Field({nullable: true})
    todo?: boolean;

    @Field({nullable: true})
    public?: boolean;

    @Field({nullable: true})
    bio?: string;

    @Field({nullable: true})
    userStatus?: string;

    @Field({nullable: true})
    billingName?: string;

    @Field({nullable: true})
    billingAddress?: string;

    @Field({nullable: true})
    defaultPayment?: string;

    @Field({nullable: true})
    defaultFund?: number;

    @Field({nullable: true})
    supportType: string;
    
    @Field({nullable: true})
    location: string;
  
    constructor(partial: DeepPartial<UserOut>) {
      for (const key in partial) {
        if (partial.hasOwnProperty(key)) {
          this[key] = partial[key];
        }
      }
    }
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class MeOut extends UserOut {
  @Field()
  emailVerify: boolean;
  @Field(() => [UserSavingOut], {nullable: true})
  saving?: UserSavingOut[];
  @Field({nullable: true})
  followingCnt?: number;
  @Field({nullable: true})
  followersCnt?: number;
}
