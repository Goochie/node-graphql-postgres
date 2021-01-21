import { ObjectType, Field } from 'type-graphql';
import { Category } from '../../categories/category.entity';
import { CategoryOut } from '../../categories/dto/category.dto';
import { OrganisationDto } from '../../organisation/dto/organisation.dto';
import { UserOut } from '../../user/dto/user.out';
import { DeliverySettingsOut } from './delivery-setings.dto';
import { Pagination } from '../../common/dto/pagination';
import { Product } from '../product.entity';
import { ReviewDto } from '../../review/dto/review.dto';
import { PostCodeOut } from '../../postcode/dto/post-code';

@ObjectType()
export class ProductOut {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field( { nullable: true })
  description?: string;

  @Field( { nullable: true })
  currency?: string;

  @Field( { nullable: true })
  quantity?: number;

  @Field( { nullable: true })
  restock?: boolean;

  @Field({nullable: true})
  cost?: number;

  @Field(() => [String], {nullable: true})
  photoUrls?: string[];

  @Field(() => [CategoryOut], {nullable: true})
  category?: Array<Partial<Category>>;

  @Field({nullable: true})
  whoMade?: string;

  @Field({nullable: true})
  contribution: number;

  @Field({nullable: true})
  serviceType: string;

  @Field({nullable: true})
  org_id?: number;

  @Field(() => OrganisationDto, {nullable: true})
  org?: Partial<OrganisationDto>;

  @Field({nullable: true})
  profile_id?: number;

  @Field(type => UserOut, { nullable: true })
  profile?: Partial<UserOut>;

  @Field(type => DeliverySettingsOut, { nullable: true })
  delivery?: Partial<DeliverySettingsOut>;

  @Field(type => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  itemType: string;

  @Field({ nullable: true })
  sku: string;

  @Field({nullable: true})
  createdDate?: Date;

  @Field({nullable: true})
  updatedDate?: Date;

  @Field({nullable: true})
  deletedDate?: Date;

  @Field({nullable: true})
  active?: boolean;

  @Field({nullable: true})
  mobility?: boolean;

  @Field({nullable: true})
  used?: boolean;

  @Field({nullable: true})
  privacy?: string;

  @Field({nullable: true})
  owner?: string;

  @Field({nullable: true})
  price_type?: string;

  @Field({nullable: true})
  min_age?: number;

  @Field({nullable: true})
  max_age?: number;

  @Field({nullable: true})
  location?: string;

  @Field({nullable: true})
  postcode: PostCodeOut;

  @Field(() => ReviewDto, {nullable: true})
  review?: Array<Partial<ReviewDto>>;
}

@ObjectType()
export class ProductSearchResult extends Pagination{
  @Field(() => ProductOut, {nullable: true})
  data:  Array<Partial<Product>>
}