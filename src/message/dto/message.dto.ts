import { ObjectType, Field, Int } from 'type-graphql';
import { UserOut } from '../../user/dto/user.out';

@ObjectType()
export class MessageDto {
  @Field()
  id: string;

  @Field({nullable: true})
  text: string;

  @Field()
  from: UserOut;

  @Field()
  to: UserOut;

  @Field({nullable: true})
  attachUrl: string;

  @Field({nullable: true})
  attachType: string;

  @Field()
  createdDate: string;

  @Field()
  isRead: boolean;

  @Field({nullable: true})
  reactTo: MessageDto;
}
