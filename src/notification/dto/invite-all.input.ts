import { InputType, Field } from 'type-graphql';
import { RelatedUser } from '../../common/dto/related-user';

@InputType()
export class InviteAllInput {
  @Field()
  entity: string;

  @Field()
  entity_id: string;

  @Field()
  title: string;

  @Field()
  sender_type?: string;

  @Field()
  sender_id?: string;
}
