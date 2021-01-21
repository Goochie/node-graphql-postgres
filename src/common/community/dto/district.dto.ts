import { ObjectType, Field } from 'type-graphql';
import { CountyOut } from './county.dto';

@ObjectType()
export class DistrictOut {

    @Field()
    district_id: string;

    @Field({nullable: true})
    district: string;

    @Field({nullable: true})
    county_id: string;

    @Field({nullable: true})
    council_website: string;

    @Field(() => CountyOut, {name: 'county'})
    county: CountyOut;
}
