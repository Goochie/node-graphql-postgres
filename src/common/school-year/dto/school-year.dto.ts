import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class SchoolyearOut {
    @Field()
    id: number;
    
    @Field()
    school_year: string;

    @Field()
    country_id: string;

    @Field()
    age: number;

    @Field()
    stage: string;
}
