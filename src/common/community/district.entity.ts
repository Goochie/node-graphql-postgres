import {Entity, Column, ManyToOne, JoinColumn, PrimaryColumn} from 'typeorm';

import {County} from './county.entity';

@Entity()
export class District {

    @PrimaryColumn()
    district_id: string;

    @Column({nullable: true})
    district: string;

    @Column({nullable: true, type: 'character varying'})
    county_id: string;

    @Column({nullable: true})
    council_website: string;

    @ManyToOne(type => County, county => county.districts, {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
    @JoinColumn({name: 'county_id', referencedColumnName: 'county_id'})
    county: County;
}
