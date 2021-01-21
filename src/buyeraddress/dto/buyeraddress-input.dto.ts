import { InputType, Field, Int } from 'type-graphql';
import { Related } from '../../common/dto/related-entity';

@InputType()
export class BuyerAddressInputDto {

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

  @Field({nullable: true})
  buyer: Related;

  @Field()
  address_type: number;
}
