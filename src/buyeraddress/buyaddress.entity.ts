import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeepPartial,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class BuyerAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buyer_name: string;

  @Column()
  street_addr: string;

  @Column({nullable: true})
  flat_addr: string;

  @Column()
  city: string;

  @Column()
  region: string;

  @Column()
  postcode_id: string;

  @ManyToOne(type => User, { nullable: true })
  @JoinColumn({ name: 'buyer_id' })
  buyer?: Partial<User>;

  @Column()
  address_type: number;

  @CreateDateColumn({name: 'created_date'})
  createdDate: Date;

  @UpdateDateColumn({name: 'updated_date'})
  updatedDate: Date;

  @Column({name: 'deleted_date', nullable: true})
  deletedDate?: Date;

  constructor(partial: DeepPartial<BuyerAddress>) {
    for (const key in partial) {
      if (partial.hasOwnProperty(key)) {
        this[key] = partial[key];
      }
    }
  }
}
