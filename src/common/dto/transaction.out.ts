import { ObjectType, Field } from 'type-graphql';
import { FundDto } from '../../fund/dto/fund.dto';
import { Fund } from '../../fund/fund.entity';
import { ProductOut } from '../../product/dto/product.dto';
import { Product } from '../../product/product.entity';

@ObjectType()
export class TransactionOut {
  @Field()
  uuid: string;

  @Field({nullable: true})
  number: number;

  @Field({nullable: true})
  stripeId: string;

  @Field({nullable: true})
  paypalId: string;

  @Field({nullable: true})
  currency: string;

  @Field({nullable: true})
  amount: number;

  @Field({nullable: true})
  fee: number;

  @Field({nullable: true})
  fund_id: number;

  @Field(type => FundDto, {nullable: true})
  fund?: Fund;

  @Field({nullable: true})
  product_id: number;

  @Field(() => ProductOut, {nullable: true})
  product?: Product;

  @Field()
  updatedDate?: Date;

  @Field({nullable: true})
  ananim: boolean;

  @Field()
  type: string;
}
