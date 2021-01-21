import { InputType, Field } from 'type-graphql';
import { RelatedUser } from '../../common/dto/related-user';

@InputType()
export class InviteInput {
  @Field()
  entity: string;

  @Field()
  entity_id: string;

  @Field()
  title: string;

  @Field(() => [RelatedUser])
  users: RelatedUser[];
}
