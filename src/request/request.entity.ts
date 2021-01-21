import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeepPartial,
  } from 'typeorm';
  
  import { User } from '../user/user.entity';
  
  @Entity()
  export class Request {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    description: string;

    @Column()
    community: string;
  
    @ManyToOne(type => User)
    @JoinColumn({ name: 'owner_id' })
    owner: User;
  
    @ManyToOne(type => User)
    @JoinColumn({ name: 'volunteer_id' })
    volunteer: User;

    @CreateDateColumn({name: 'created_date'})
    createdDate?: Date;
  
    @UpdateDateColumn({name: 'updated_date'})
    updatedDate?: Date;

    @Column({name: 'deleted_date', nullable: true})
    deletedDate?: Date;
  
    @Column({name: 'fulfilled_date', nullable: true})
    fulfilledDate?: Date;
  
    constructor(partial: DeepPartial<Request>) {
      for (const key in partial) {
        if (partial.hasOwnProperty(key)) {
          this[key] = partial[key];
        }
      }
    }
  }
  