import { Field, InputType } from 'type-graphql';
import { IsEmail, IsPhoneNumber, IsOptional } from 'class-validator';
import { Fund } from '../../fund/fund.entity';

@InputType()
export class UserUpdate {
    @Field()
    id: number;

    @Field({ nullable: true })
    @IsOptional()
    username: string;

    @Field({ nullable: true })
    @IsOptional()
    password: string;

    @Field({ nullable: true })
    @IsOptional()
    oldPassword: string;

    @Field({ nullable: true })
    @IsEmail()
    @IsOptional()
    email: string;

    @Field({ nullable: true })
    @IsOptional()
    mobile?: string;

    @IsOptional()
    @Field({ nullable: true })
    postcode?: string;

    @Field(type => [String], { nullable: true })
    @IsOptional()
    compliteTodo?: string[];

    @Field({ nullable: true })
    @IsOptional()
    orgTodo?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    todo?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    photoUrl?: string;

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
}
