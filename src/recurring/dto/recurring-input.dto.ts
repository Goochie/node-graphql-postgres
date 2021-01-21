import { InputType, Field } from "type-graphql";

@InputType()
export class RecurringInputDto {  
    @Field()
    repeatMode: number;

    @Field()
    endMode: number;
    @Field({nullable: true})
    endDate?: string;
    @Field({nullable: true})
    countDays?: number;

    @Field({nullable: true})
    repeatDays?: string;

    @Field({nullable: true})
    monthlyOption?: number;
    @Field({nullable: true})
    repeatDate?: number;
    @Field({nullable: true})
    repeatPos?: number;
    @Field({nullable: true})
    repeatDay?: number;
}