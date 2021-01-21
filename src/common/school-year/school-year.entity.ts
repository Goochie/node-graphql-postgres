import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column} from 'typeorm';
import { Countries } from '../community/countries.entity';

@Entity()
export class SchoolYear {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  country_id: string;

  @ManyToOne(type => Countries, {nullable: true})
  @JoinColumn({name: 'country_id'})
  country: Countries;

  @Column()
  school_year: string;

  @Column()
  age: number;

  @Column()
  stage: string;
}
