import {Entity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn} from 'typeorm';
import {Region} from './region.entity';

@Entity()
export class Countries {

    @PrimaryColumn()
    country_id: string;

    @Column({nullable: true})
    country: string;

    @OneToMany(type => Region, region => region.counties)
    regions: Region[];
}
