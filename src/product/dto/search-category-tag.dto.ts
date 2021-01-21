import { ObjectType, Field, InputType } from 'type-graphql';
import { SearchCategoryTagEnum } from './enums/search-category-tag';
import { CategoryTypeDto } from '../../categories/dto/category.type.dto';

@ObjectType()
export class SearchCategoryTag {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  searchType: SearchCategoryTagEnum;

  @Field()
  categoryType?: CategoryTypeDto | 'TAG';
}

@InputType()
export class SearchCategoryTagInput {
  @Field({nullable: true})
  id?: number;

  @Field({nullable: true})
  name?: string;

  @Field({nullable: true})
  searchType?: SearchCategoryTagEnum;

  @Field({nullable: true})
  categoryType?: CategoryTypeDto | 'TAG';

  @Field({nullable: true})
  parent?: number;

  @Field({nullable: true})
  type?: string;
}
