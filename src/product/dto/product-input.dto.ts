import { InputType, Field, Int } from 'type-graphql';
import { Related } from '../../common/dto/related-entity';
import { CategoryOut } from '../../categories/dto/category.dto';
import { RelatedUiid } from '../../common/dto/related-uiid-entity';
import { PostCodeOut } from '../../postcode/dto/post-code';

@InputType()
export class ProductInputDto {
  @Field({ nullable: true })
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

  @Field({nullable: true })
  cost?: number;

  @Field(() => [String], {nullable: true})
  photoUrls?: string[];

  @Field(() => [Related], {nullable: true})
  category?: Array<Partial<CategoryOut>>;

  @Field({nullable: true})
  whoMade?: string;

  @Field({nullable: true})
  contribution?: number;

  @Field({nullable: true})
  serviceType: string;

  @Field({nullable: true})
  org_id?: number;

  @Field(() => Related, {nullable: true})
  org?: Related;

  @Field({nullable: true})
  profile_id?: number;

  @Field(type => Related, { nullable: true })
  profile?: Related;

  @Field(type => RelatedUiid, { nullable: true })
  delivery?: RelatedUiid;

  @Field(type => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  itemType: string;

  @Field({ nullable: true })
  sku: string;

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
  postcode?: string;
}

