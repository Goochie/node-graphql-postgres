import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, PrimaryColumn} from 'typeorm';

import {Countries} from './countries.entity';
import {County} from './county.entity';

@Entity()
export class Region {

    @PrimaryColumn()
    region_id: string;

    @Column({nullable: true})
    region: string;

    @Column({nullable: true})
    country_id: string;

    @ManyToOne(type => Countries, country => country.regions)
    @JoinColumn({ name: 'country_id'})
    country: Countries;

    @OneToMany(type => County, county => county.region)
    counties: County[];
}
