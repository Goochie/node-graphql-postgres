import { ObjectType, Field, Int } from 'type-graphql';
import { EventDto } from '../../event/dto/event.dto';
import { OrganisationDto } from '../../organisation/dto/organisation.dto';
import { FundDto } from '../../fund/dto/fund.dto';
import { UserOut } from '../../user/dto/user.out';
import { ProductOut } from '../../product/dto/product.dto';

@ObjectType()
export class ReviewDto {
  @Field()
  id: string;

  @Field()
  text: string;

  @Field(type => OrganisationDto, { nullable: true })
  organisation?: OrganisationDto;

  @Field(type => OrganisationDto, { nullable: true })
  community?: OrganisationDto;

  @Field(type => UserOut)
  user: UserOut;

  @Field({nullable: true})
  rating?: number;

  @Field({nullable: true})
  createdDate: Date;

  @Field({nullable: true})
  updatedDate: Date;

  @Field({ nullable: true })
  parent_id: string;

  @Field(type => ReviewDto, { nullable: true})
  parent: ReviewDto;

  @Field({ nullable: true })
  children_count?: number;

  @Field(type => ProductOut, {nullable: true})
  product?: ProductOut
}
