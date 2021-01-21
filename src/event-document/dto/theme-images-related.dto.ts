import { Field, InputType } from 'type-graphql';

@InputType()
export class EventDocumentRelated {
  @Field()
  id: number;

  @Field({nullable: true})
  key?: string;

  @Field({nullable: true})
  url?: string;

  @Field({nullable: true})
  filename?: string;

  @Field({nullable: true})
  filesize?: number;

  @Field({nullable: true})
  filetype?: string;

  @Field({nullable: true})
  description?: string;
}
