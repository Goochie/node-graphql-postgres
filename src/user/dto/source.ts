import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class SourceOut {
  @Field({nullable: true})
  id: string;

  @Field({nullable: true})
  object: string;

  @Field({nullable: true})
  brand: string;

  @Field({nullable: true})
  country: string;

  @Field({nullable: true})
  customer: string;

  @Field({nullable: true})
  cvc_check: string;

  @Field({nullable: true})
  dynamic_last4: string;

  @Field({nullable: true})
  exp_month: number;

  @Field({nullable: true})
  exp_year: number;

  @Field({nullable: true})
  last4: string;

  @Field({nullable: true})
  name: string;
}