import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class CategoryOut {
  @Field({nullable: true})
  id?: number;

  @Field({nullable: true})
  name?: string;

  @Field({nullable: true})
  type?: string;

  @Field(() => Int,{nullable: true})
  parent?: number;
}

@ObjectType()
export class CategorySubmenuOut {
  @Field({nullable: true})
  id?: number;

  @Field()
  name?: string;

  @Field()
  type?: string;

  @Field(() => Int)
  parent?: number;

  @Field(() => Int)
  products_count?: number;
}
