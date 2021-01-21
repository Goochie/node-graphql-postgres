import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class OpeningHoursDto {

    @Field()
    day?: number;

    @Field({nullable: true})
    startTime?: string;

    @Field({nullable: true})
    endTime?: string;

}