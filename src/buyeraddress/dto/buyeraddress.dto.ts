import { ObjectType, Field, Int } from 'type-graphql';
import { UserOut } from '../../user/dto/user.out';

@ObjectType()
export class BuyerAddressDto {
  @Field()
  id: number;

  @Field()
  buyer_name: string;

  @Field()
  street_addr: string;

  @Field({nullable: true})
  flat_addr: string;

  @Field()
  city: string;

  @Field()
  region: string;

  @Field()
  postcode_id: string;

  @Field()
  createdDate: Date;

  @Field()
  updatedDate: Date;

  @Field({nullable: true})
  buyer: UserOut;

  @Field()
  address_type: number;
}
