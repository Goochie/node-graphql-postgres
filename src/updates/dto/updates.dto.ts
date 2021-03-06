import { ObjectType, Field, Int } from 'type-graphql';
import { EventDto } from '../../event/dto/event.dto';
import { OrganisationDto } from '../../organisation/dto/organisation.dto';
import { FundDto } from '../../fund/dto/fund.dto';
import { UserOut } from '../../user/dto/user.out';

@ObjectType()
export class UpdateDto {
  @Field()
  id: string;

  @Field()
  text: string;

  @Field(type => OrganisationDto, { nullable: true })
  organisation?: OrganisationDto;

  @Field(type => EventDto, { nullable: true })
  event?: EventDto;

  @Field(type => FundDto , { nullable: true })
  fund?: FundDto;

  @Field(type => UserOut)
  user: UserOut;

  @Field({nullable: true})
  attachUrl?: string;

  @Field({nullable: true})
  createdDate: Date;

  @Field({nullable: true})
  updatedDate: Date;

  @Field({ nullable: true })
  parent_id: string;

  @Field(type => UpdateDto, { nullable: true})
  parent: UpdateDto;

  @Field({ nullable: true })
  children_count?: number;
}
