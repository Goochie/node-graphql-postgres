import { ObjectType, Field } from 'type-graphql';

/* tslint:disable:max-classes-per-file */
@ObjectType()
export class FundChartData {
  @Field()
  name: string;

  @Field()
  value: number;
}

@ObjectType()
export class FundStat {
  @Field(() => [FundChartData])
  pie: FundChartData[];

  @Field()
  total: number;
}
