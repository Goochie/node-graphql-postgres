import { Field, ObjectType, InputType } from 'type-graphql';
import { UserOut } from '../../user/dto/user.out';

@InputType()
export class DeliverySettingsInput {
  @Field({nullable: true})
  id?: string;

  @Field({nullable: true})
  dispatch?: string;

  @Field({nullable: true})
  processing: string;

  @Field({nullable: true})
  cost: number;

  @Field({nullable: true})
  days?: number;

  @Field({nullable: true})
  additional: number;

  @Field({nullable: true})
  charge: string;

  @Field({nullable: true})
  user_id?: number;

  @Field(() => Boolean, {nullable: true})
  reuse?: boolean;
}
