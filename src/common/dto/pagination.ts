import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class PaginationOptions {
    @Field({nullable: true})
    cursor: number;
    
    @Field({nullable: true})
    total: number;
}

@ObjectType()
export class Pagination {
    @Field({nullable: true})
    meta: PaginationOptions;
}