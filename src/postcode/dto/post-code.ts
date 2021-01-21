import { Field, ObjectType, Float, InputType } from 'type-graphql';


@ObjectType()
export class Coordinates {
  @Field()
  type: string;

  @Field(() => [Float, Float])
  coordinates: number[];
}


@InputType()
export class CoordinatesInput {
  @Field()
  type: string;

  @Field(() => [Float, Float])
  coordinates: number[];
}


@ObjectType()
export class PostCodeOut {
  @Field({nullable: true})
  id?: number;

  @Field()
  postcode?: string;

  @Field()
  communityId?: string;

  @Field(() => Coordinates)
  coordinates?: Coordinates;
}


@InputType()
export class PostCodeInput {
  @Field({nullable: true})
  id?: number;
  
  @Field()
  postcode?: string;
  
  @Field()
  communityId?: string;
  
  @Field(() => CoordinatesInput, {nullable: true})
  coordinates?: CoordinatesInput;
}

