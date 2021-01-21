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
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity({name: 'product_tag'})
export class Tags {
  @PrimaryGeneratedColumn()
  id: number;

  @Unique('UTag', ['tag'])
  @Column()
  tag?: string;
}
