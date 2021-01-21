import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class ReviewParamsInputDto {
  @Field({description: 'ORGANISATION, COMMUNITY, PRODUCT'})
  entity: string;

  @Field(() => String)
  id: string;
}
