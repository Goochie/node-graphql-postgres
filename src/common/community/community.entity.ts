import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToOne, JoinColumn} from 'typeorm';
import { LocalCouncil } from './local-council.entity';
import { Field } from 'type-graphql';
import { District } from './district.entity';
import { County } from './county.entity';


@Entity()
export class Community {

    @PrimaryColumn()
    community_id: string;

    @Column({nullable: true})
    community: string;

    @Column({nullable: true})
    county_or_district_id: string;

    county: County;

    district: District;

    @Column({nullable: true})
    local_council_id: string;

    @ManyToOne(type => LocalCouncil, {nullable: true})
    @JoinColumn({name: 'local_council_id'})
    localCouncil: LocalCouncil;
}
