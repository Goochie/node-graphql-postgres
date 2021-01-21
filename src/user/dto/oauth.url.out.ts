import { ObjectType, Field } from 'type-graphql';
import { PostCodeOut } from '../../postcode/dto/post-code';
import { UserOut } from './user.out';

@ObjectType()
export class OauthUrlOut extends UserOut {
    @Field({nullable: true})
    yahoo?: string;

    @Field({nullable: true})
    google?: string;

    @Field({nullable: true})
    outlook?: string;

    @Field({nullable: true})
    stripe?: string;
}
