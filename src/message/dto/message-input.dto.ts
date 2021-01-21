import { InputType, Field, Int } from 'type-graphql';
import { Related } from '../../common/dto/related-entity';
import { RelatedUiid } from '../../common/dto/related-uiid-entity';

@InputType()
export class MessageInputDto {
  @Field({nullable: true})
  id?: string;

  @Field({nullable: true})
  text?: string;

  @Field({nullable: true})
  from?: Related;

  @Field()
  to: Related;

  @Field({nullable: true})
  attachUrl?: string;

  @Field({nullable: true})
  attachType?: string;

  @Field({nullable: true})
  reactTo?: RelatedUiid;
}
