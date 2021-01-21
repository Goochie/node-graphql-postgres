import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Generated,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { User } from '../user/user.entity';


@Entity({name: 'deliverysettings'})
export class DeliverySettings {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id?: string;

  @Column()
  processing: string;

  @Column({nullable: true})
  days: number;

  @Column({nullable: true})
  cost: number;

  @Column({nullable: true})
  additional: number;

  @Column()
  charge: string;

  @Column({default: false})
  reuse: boolean;

  @Column({name: 'user_id'})
  user_id?: number;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'user_id' })
  user?: Partial<User>;
}

