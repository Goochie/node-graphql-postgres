import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class EventDocumentOut {
  @Field({nullable: true})
  id: number;

  @Field()
  key: string;

  @Field()
  url: string;

  @Field()
  filename: string;

  @Field()
  filesize: number;

  @Field()
  filetype: string;

  @Field({nullable: true})
  description: string;
}
