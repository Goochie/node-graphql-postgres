import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class PaymentData {
  @Field()
  amount: number;

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

  @Field({nullable: true})
  cardId: string;

  @Field({nullable: true})
  save: boolean;

  @Field({nullable: true})
  ananim: boolean;
}
