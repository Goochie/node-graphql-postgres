import { ObjectType, Field, Int } from 'type-graphql';
import { EventDto } from '../../event/dto/event.dto';
import { OrganisationDto } from '../../organisation/dto/organisation.dto';
import { FundDto } from '../../fund/dto/fund.dto';
import { UserOut } from '../../user/dto/user.out';

@ObjectType()
export class NotificationDto {
  @Field()
  id: string;

  @Field()
  text: string;

  @Field({nullable: true})
  entity_id: string;

  @Field({nullable: true})
  entity: string;

  @Field({nullable: true})
  isRead: boolean;

  @Field(type => UserOut)
  user: UserOut;

  @Field(type => UserOut)
  from: UserOut;

  @Field({nullable: true})
  icon: string;

  @Field({nullable: true})
  type: string;

  @Field({nullable: true})
  action?: string;

  @Field({nullable: true})
  createdDate?: Date;
}
