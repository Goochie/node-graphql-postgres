import { ObjectType, Field } from 'type-graphql';
import { ProductOut } from './product.dto';
import { Product } from '../product.entity';
import { OrganisationDto } from '../../organisation/dto/organisation.dto';
import { Organisation } from '../../organisation/organisation.entity';
import { CategoryTypeDto } from '../../categories/dto/category.type.dto';
import { CategoryOut } from '../../categories/dto/category.dto';
import { Category } from '../../categories/category.entity';

@ObjectType()
export class PreselectedCategory {
    @Field(() => [OrganisationDto], {nullable: true})
    localBusiness?: Array<Partial<Organisation>>;

    @Field(() => [ProductOut], {nullable: true})
    localFood?: Array<Partial<Product>>;

    @Field(() => [ProductOut], {nullable: true})
    localHelp?: Array<Partial<Product>>;

    @Field(() => [ProductOut], {nullable: true})
    childrenActivities?: Array<Partial<Product>>;
}

@ObjectType()
export class PreselectedCategoryTypes {
    @Field( {nullable: true})
    title?: string

    @Field(() => [CategoryOut], {nullable: true})
    categories: Array<Partial<Category>>;
}