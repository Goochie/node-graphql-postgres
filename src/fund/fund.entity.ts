import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeepPartial,
  JoinTable,
  OneToMany,
} from 'typeorm';

import * as PGDate from 'postgres-date';

import { ThemeImages } from '../theme-images/theme-images.entity';
import { Category } from '../categories/category.entity';
import { User } from '../user/user.entity';
import { Organisation } from '../organisation/organisation.entity';
import { Update } from '../updates/updates.entity';

@Entity()
export class Fund {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({nullable: true})
  organisation_id: number;

  @ManyToOne(type => Organisation, { nullable: true })
  @JoinColumn({ name: 'organisation_id' })
  organisation?: Organisation;

  @ManyToMany(type => Category, { nullable: true })
  @JoinTable({name: 'fund_categories', joinColumn: {name: 'fund_id'}, inverseJoinColumn: {name: 'category_id'}})
  category: Category[];

  @ManyToOne(type => ThemeImages, { nullable: true })
  @JoinColumn({ name: 'image_id' })
  theme?: ThemeImages;

  @Column()
  isPublic: boolean;

  @Column({default: false})
  isPublished: boolean;

  @Column({type: 'timestamptz'})
  startDate: Date;

  @Column({type: 'timestamptz', nullable: true})
  endDate: Date;

  @Column()
  amount: number;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @Column({name: 'photo_url', nullable: true})
  photoUrl?: string;

  @CreateDateColumn({name: 'created_date'})
  createdDate: Date;

  @UpdateDateColumn({name: 'updated_date'})
  updatedDate: Date;

  @Column({name: 'deleted_date', nullable: true})
  deletedDate?: Date;

  @ManyToMany(type => User, { nullable: true })
  @JoinTable({name: 'fund_followers', joinColumn: {name: 'fund_id'}, inverseJoinColumn: {name: 'user_id'}})
  followers?: User[];

  @Column({name: 'raised', nullable: true})
  raised: number;

  @Column({name: 'raised_date', nullable: true})
  raisedData?: Date;

  @Column({name: 'payout', nullable: true, default: false})
  payout?: boolean;

  @Column({name: 'thank_title', nullable: true})
  thankTitle: string;

  @Column({name: 'thank_message', nullable: true})
  thankMessage: string;

  followed?: boolean;

  follower_count: number;

  @OneToMany(type => Update, updates => updates.fund)
  updates: Update[];

  updates_count: number;

  constructor(partial: DeepPartial<Fund>) {
    for (const key in partial) {
      if (partial.hasOwnProperty(key)) {
        this[key] = partial[key];
      }
    }
  }

  @ManyToMany(type => User, { nullable: true })
  @JoinTable({name: 'fund_voters', joinColumn: {name: 'fund_id'}, inverseJoinColumn: {name: 'user_id'}})
  voters: User[];

  voted?: boolean;

  @Column({name: 'vote_count', nullable: true})
  vote_count: number;
}
