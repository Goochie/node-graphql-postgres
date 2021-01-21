import { Field, InputType } from 'type-graphql';
import { IsEmail, IsPhoneNumber, IsOptional } from 'class-validator';

@InputType()
export class UserInput {
    @Field()
    username: string;
    @Field()
    password: string;

    @Field()
    @IsEmail()
    email: string;

    @Field({ nullable: true })
    @IsOptional()
    mobile?: string;

    @IsOptional()
    @Field()
    postcode?: string;
}
