import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, PrimaryColumn} from 'typeorm';

import {Region} from './region.entity';
import {District} from './district.entity';

@Entity()
export class County {

    @PrimaryColumn()
    county_id: string;

    @Column({nullable: true})
    county: string;

    @Column({nullable: true})
    region_id: string;

    @Column({nullable: true})
    council_website: string;

    @Column({nullable: true})
    image: string;

    @Column({nullable: true})
    other: string;

    @ManyToOne(type => Region, region => region.counties)
    @JoinColumn({name: 'region_id'})
    region: Region;

    @OneToMany(type => District, district => district.county)
    districts: District[];
}
