import { Fund } from '../../fund/fund.entity';
import { FundDto } from '../../fund/dto/fund.dto';
import { ObjectType, Field } from 'type-graphql';
/* tslint:disable:max-classes-per-file */

@ObjectType()
export class PartnerStatsItem {
  @Field(() => FundDto)
  fund?: Fund;

  @Field()
  value: number;

  @Field()
  name: string;
}

@ObjectType()
export class PartnerStats {
  @Field()
  total: number;

  @Field(() => [PartnerStatsItem])
  funds: PartnerStatsItem[];
}
