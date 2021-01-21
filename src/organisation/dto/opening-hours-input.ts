import { InputType, Field } from 'type-graphql';

@InputType()
export class OpeningHoursInput {

    @Field()
    day?: number;

    @Field({nullable: true})
    startTime?: string;

    @Field({nullable: true})
    endTime?: string;

}