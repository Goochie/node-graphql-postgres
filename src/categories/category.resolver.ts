import { Resolver, Args, Query } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { type } from 'os';
import { CategoryTypeDto } from './dto/category.type.dto';
import { CategoryOut, CategorySubmenuOut } from './dto/category.dto';
import { Arg } from 'type-graphql';

@Resolver('Category')
export class CategoryResolver {
  constructor(
    private categorySrv: CategoryService,
  ) { }

  @Query(() => [CategoryOut])

  async getCategories(
    @Arg('type', {description: `Enum (${Object.values(CategoryTypeDto).join(', ')})`}) @Args('type') categoryType: string)
  {
    return await this.categorySrv.getCategories(categoryType);
  }

  @Query(() => [CategoryOut])
  async getPopularCategories(
    @Arg('type', {description: `Enum (${Object.values(CategoryTypeDto).join(', ')})`}) @Args('type') categoryType: string)
  {
    return await this.categorySrv.getPopularCategories(categoryType);
  }

  @Query(() => [CategorySubmenuOut])
  async getStoreSearchSubmenuCategories()
  {
    return await this.categorySrv.getStoreSearchSubmenuCategories();
  }

  
}
