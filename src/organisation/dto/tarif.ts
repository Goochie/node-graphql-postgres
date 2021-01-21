import { ObjectType, Field } from 'type-graphql';

export interface Tariff {
  label: Label;
  fillColor: string;
  data: number[];
}

interface Label {
  supplier: string;
  tariff: string;
}

@ObjectType()
export class TariffOut {
  @Field()
  value: number;
  @Field()
  name: string;
  @Field()
  organisation: string;
}
