import { ObjectType, Field } from 'type-graphql';
import { DeepPartial } from 'typeorm';
import { UserOut } from '../../user/dto/user.out';

@ObjectType()
export class RequestDto {
  @Field()
  id: number;

  @Field()
  description: string;

  @Field()
  community: string;

  @Field({nullable: true})
  owner: UserOut;

  @Field({nullable: true})
  volunteer: UserOut;

  @Field()
  updatedDate: Date;

  @Field({nullable: true})
  deletedDate?: Date;

  @Field({nullable: true})
  fulfilledDate?: Date;
  
  constructor(partial: DeepPartial<RequestDto>) {
    for (const key in partial) {
      if (partial.hasOwnProperty(key)) {
        this[key] = partial[key];
      }
    }
  }
}
