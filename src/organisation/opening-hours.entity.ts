import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, DeepPartial } from "typeorm";
import { Organisation } from "./organisation.entity";

@Entity({name: 'opening_hours'})
export class OpeningHours {
  
  @PrimaryGeneratedColumn()
  id?: number;
    
  @Column()
  day: number;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @ManyToOne(type => Organisation, org => org.opening)
  @JoinColumn({name: 'org_id', referencedColumnName: 'id'})
  organisation: Organisation;

  constructor(partial: DeepPartial<OpeningHours>) {
    Object.assign(this, partial);
  }

}