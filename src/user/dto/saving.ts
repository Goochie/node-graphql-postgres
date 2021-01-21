import { ObjectType, Field, InputType } from 'type-graphql';
/* tslint:disable:max-classes-per-file */

@ObjectType()
export class UserSavingOut {
  @Field({nullable: true})
  id?: number;

  @Field({nullable: true})
  rooms?: number;

  @Field({nullable: true})
  type?: string;
}

@InputType()
export class UserSavingInput {
  @Field({nullable: true})
  id?: number;

  @Field({nullable: true})
  rooms?: number;

  @Field({nullable: true})
  type?: string;
}
