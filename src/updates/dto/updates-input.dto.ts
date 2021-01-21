import { InputType, Field, Int } from 'type-graphql';
import { Related } from '../../common/dto/related-entity';
import { RelatedUiid } from '../../common/dto/related-uiid-entity';
import { CommunityRelated } from '../../common/community/dto/community-related-input';

@InputType()
export class UpdateInputDto {
  @Field({nullable: true})
  id: string;

  @Field()
  text: string;

  @Field(type => CommunityRelated, { nullable: true })
  community?: CommunityRelated;

  @Field(type => Related, { nullable: true })
  organisation?: Related;

  @Field(type => Related, { nullable: true })
  event?: Related;

  @Field(type => Related, { nullable: true })
  fund?: Related;

  @Field(type => Related, { nullable: true })
  toUser?: Related;

  @Field({nullable: true})
  attachUrl?: string;

  @Field({nullable: true})
  createdDate: Date;

  @Field({nullable: true})
  updatedDate: Date;

  @Field({ nullable: true })
  parent_id: string;

  @Field(type => RelatedUiid, { nullable: true})
  parent: RelatedUiid;
}
