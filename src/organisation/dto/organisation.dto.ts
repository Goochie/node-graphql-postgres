import { ObjectType, Field } from 'type-graphql';
import { CategoryOut } from '../../categories/dto/category.dto';
import { ThemeImagesOut } from '../../theme-images/dto/theme-images.dto';
import { PostCodeOut } from '../../postcode/dto/post-code';
import { UserOut } from '../../user/dto/user.out';
import { ProductOut } from '../../product/dto/product.dto';
import { OpeningHoursDto } from './opening-hours-dto';

@ObjectType()
export class OrganisationDto {
  @Field()
  id: number;

  @Field({nullable: true})
  title: string;

  @Field({nullable: true})
  description: string;

  @Field({nullable: true})
  email?: string;

  @Field({nullable: true})
  postcode: PostCodeOut;

  @Field({nullable: true})
  website: string;

  @Field({nullable: true})
  phone: string;

  @Field(() => [CategoryOut], {nullable: true })
  category: CategoryOut[];

  @Field({nullable: true})
  theme?: ThemeImagesOut;

  @Field({nullable: true})
  photoUrl?: string;

  @Field({nullable: true})
  followed: boolean;

  @Field({nullable: true})
  partner: boolean;

  @Field({nullable: true})
  rating?: number;

  @Field({nullable: true})
  reviewCount: number;

  @Field({nullable: true})
  eventsCount: number;

  @Field({nullable: true})
  fundCount: number;

  @Field({nullable: true})
  updateCount: number;

  @Field({nullable: true})
  owner: UserOut;

  @Field({nullable: true})
  owner_id: number;

  @Field({nullable: true})
  createdDate: Date;

  @Field({nullable: true})
  updatedDate: Date;

  @Field(() => [ProductOut], {nullable: true})
  products: [ProductOut];

  @Field({nullable: true})
  invited?: boolean;

  @Field({nullable: true})
  defaultFund?: number;

  @Field({nullable: true})
  location?: string;

  @Field(() => [OpeningHoursDto], {nullable: true})
  opening?: [OpeningHoursDto];
}
