import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class ProductFilter {
  @Field(() => [Int], {nullable: true})
  categoryes?: number[];

  @Field({nullable: true})
  itemType?: string;
}
