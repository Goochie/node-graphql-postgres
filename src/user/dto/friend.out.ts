import { ObjectType, Field } from 'type-graphql';
import { PostCodeOut } from '../../postcode/dto/post-code';
import { UserOut } from './user.out';

@ObjectType()
export class FriendOut extends UserOut {
    @Field({nullable: true})
    lastMessage?: string;

    @Field({nullable: true})
    lastDate?: Date;

    @Field({nullable: true})
    isRead?: boolean;

    @Field({nullable: true})
    status?: string;
}
