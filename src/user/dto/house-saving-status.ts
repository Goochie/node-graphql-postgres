import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class HouseSavingStatus {
  @Field({nullable: true})
  energy: Date;

  @Field({nullable: true})
  insurance: Date;

  @Field({nullable: true})
  mobile: Date;

  @Field({nullable: true})
  phoneInternet: Date;
}
