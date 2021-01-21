import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class RelatedUser {
  @Field({nullable: true})
  id?: string;

  @Field({nullable: true})
  username?: string;

  @Field({nullable: true})
  email?: string;

  @Field({nullable: true})
  photoUrl?: string;
}
