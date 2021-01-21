import { InputType, Field } from 'type-graphql';

@InputType()
export class UpdateParamsInputDto {
  @Field({description: 'ORGANISATION, EVENT, FUND, USER, COMMUNITY'})
  entity: string;

  @Field(() => String)
  id: string;
}
