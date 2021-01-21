import { ObjectType, Field } from 'type-graphql';
import { LocalCouncil, LocalCouncilOut } from '../local-council.entity';
import { CountyOut } from './county.dto';
import { DistrictOut } from './district.dto';

@ObjectType()
export class CommunityDto {
  @Field({nullable: true})
  community_id: string;

  @Field({nullable: true})
  community: string;

  @Field({nullable: true})
  county_or_district_id: string;

  @Field(() => LocalCouncilOut, {nullable: true})
  localCouncil: LocalCouncil;

  @Field(() => CountyOut, {nullable: true})
  county: CountyOut;

  @Field(() => DistrictOut, {nullable: true})
  district: DistrictOut;
}
