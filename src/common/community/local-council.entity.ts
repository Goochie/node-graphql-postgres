import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, PrimaryColumn} from 'typeorm';

import {Region} from './region.entity';
import {District} from './district.entity';
import { ObjectType, Field } from 'type-graphql';

@Entity()
@ObjectType()
export class LocalCouncil {
    @PrimaryColumn('uuid')
    @Field()
    id: string;

    @Column({nullable: true, name: 'local_council'})
    @Field({nullable: true})
    localCouncil: string;

    @Column({nullable: true, name: 'local_council_website'})
    @Field({nullable: true})
    localCouncilWebsite: string;
}

// tslint:disable-next-line:max-classes-per-file
@ObjectType()
export class LocalCouncilOut {
    @Field()
    id: string;

    @Field({nullable: true})
    localCouncil: string;

    @Field({nullable: true})
    localCouncilWebsite: string;
}
