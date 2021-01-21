import { Field, ObjectType } from 'type-graphql';
import { UserOut } from '../../user/dto/user.out';

@ObjectType()
export class DeliverySettingsOut {
  @Field({nullable: true})
  id?: string;

  @Field({nullable: true})
  processing: string;

  @Field({nullable: true})
  days: number;

  @Field({nullable: true})
  cost: number;

  @Field({nullable: true})
  additional: number;

  @Field({nullable: true})
  charge: string;

  @Field({nullable: true})
  user_id?: number;

  @Field(() => UserOut, {nullable: true})
  user?: Partial<UserOut>;

  @Field(() => Boolean, {nullable: true})
  reuse?: boolean;
}
