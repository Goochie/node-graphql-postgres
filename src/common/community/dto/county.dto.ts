import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class CountyOut {

    @Field()
    county_id: string;

    @Field({nullable: true})
    county: string;

    @Field({nullable: true})
    region_id: string;

    @Field({nullable: true})
    council_website: string;

    @Field({nullable: true})
    image: string;

    @Field({nullable: true})
    other: string;
}
