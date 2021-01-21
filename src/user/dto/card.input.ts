import { Field, InputType } from 'type-graphql';

@InputType()
export class CardData {
  @Field({nullable: true})
  card: string;

  @Field({nullable: true})
  exp_month: string;

  @Field({nullable: true})
  exp_year: string;

  @Field({nullable: true})
  cvc: string;

  @Field({nullable: true})
  cardName: string;
}
