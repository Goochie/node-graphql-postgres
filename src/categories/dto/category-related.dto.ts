import { Field, InputType, Int } from 'type-graphql';
import { CategoryTypeDto } from './category.type.dto';

@InputType()
export class CategoryRelated {
  @Field()
  id: number;

  @Field({nullable: true})
  name?: string;

  @Field({nullable: true})
  type?: CategoryTypeDto;

  @Field(() => Int, {nullable: true})
  parent: number;
}
