import { InputType, Field, Int } from 'type-graphql';
import { Related } from '../../common/dto/related-entity';
import { RelatedUiid } from '../../common/dto/related-uiid-entity';

@InputType()
export class ReviewInputDto {
  @Field({nullable: true})
  id?: string;

  @Field()
  text: string;

  @Field(type => Related, { nullable: true })
  organisation?: Related;

  @Field(type => Related, { nullable: true })
  community?: Related;

  @Field({nullable: true})
  rating?: number;

  @Field({nullable: true})
  createdDate: Date;

  @Field({nullable: true})
  updatedDate: Date;

  @Field({ nullable: true })
  parent_id: string;

  @Field(type => RelatedUiid, { nullable: true})
  parent: RelatedUiid;

  @Field(type => RelatedUiid, { nullable: true })
  product?: RelatedUiid;
}
