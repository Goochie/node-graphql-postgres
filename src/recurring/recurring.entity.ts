import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index, CreateDateColumn, UpdateDateColumn, DeepPartial } from 'typeorm';
import { Event } from '../event/event.entity';

@Entity({name: 'recurring'})
export class Recurring {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    repeatMode: number;

    @Column()
    endMode: number;
    @Column({nullable: true})
    endDate?: string;
    @Column({nullable: true})
    countDays?: number;

    @Column({nullable: true})
    repeatDays?: string;

    @Column({nullable: true})
    monthlyOption?: number;
    @Column({nullable: true})
    repeatDate?: number;
    @Column({nullable: true})
    repeatPos?: number;
    @Column({nullable: true})
    repeatDay?: number;

    @CreateDateColumn({name: 'created_date'})
    createdDate: Date;  
    @UpdateDateColumn({name: 'updated_date'})
    updatedDate: Date;  
    @Column({name: 'deleted_date', nullable: true})
    deletedDate?: Date;


    constructor(partial: DeepPartial<Recurring>) {
      for (const key in partial) {
        if (partial.hasOwnProperty(key)) {
          this[key] = partial[key];
        }
      }
    }
}