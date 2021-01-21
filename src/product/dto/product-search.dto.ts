import { InputType, Field, Int } from 'type-graphql';
import { SearchCategoryTag, SearchCategoryTagInput } from './search-category-tag.dto';

@InputType()
export class SearchSort {
  @Field({ nullable: true })
  field?: string;

  @Field({ nullable: true })
  direction?: 'ASC' | 'DESC';
}

@InputType()
export class Location {
  @Field(() => [Number], { nullable: true })
  coordinates?: Array<number>;

  @Field({ nullable: true })
  radius?: number
}

@InputType()
export class ProductSearchDto {
  @Field(() => [SearchCategoryTagInput], { nullable: true })
  categories?: Array<Partial<SearchCategoryTag>>;

  @Field({ nullable: true })
  items?: boolean;

  @Field({ nullable: true })
  services?: boolean;

  @Field({ nullable: true })
  sort?: SearchSort;

  @Field({ nullable: true })
  skip?: number;

  @Field({ nullable: true })
  take?: number;

  @Field(() => Location, { nullable: true })
  location?: Location;

  @Field({ nullable: true })
  searchString: string;
}
