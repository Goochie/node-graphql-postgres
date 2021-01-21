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

import { ThemeImages } from '../theme-images/theme-images.entity';
import { Category } from '../categories/category.entity';
import { User } from '../user/user.entity';
import { PostCode } from '../postcode/post-code.entity';
import { Review } from '../review/review.entity';
import { Fund } from '../fund/fund.entity';
import { Update } from '../updates/updates.entity';
import { Event } from '../event/event.entity';
import { Product } from '../product/product.entity';
import { OpeningHours } from './opening-hours.entity';

@Entity()
export class Organisation {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({nullable: true})
  email?: string;

  @Column({nullable: true})
  website?: string;

  @Column()
  phone: string;

  @ManyToMany(type => Category, { nullable: true })
  @JoinTable({name: 'organisation_categories', joinColumn: {name: 'org_id'}, inverseJoinColumn: {name: 'category_id'}})
  category: Category[];

  @ManyToOne(type => ThemeImages, { nullable: true })
  @JoinColumn({ name: 'image_id' })
  theme?: ThemeImages;

  @ManyToOne(type => PostCode, { nullable: true })
  @JoinColumn({ name: 'postcode_id' })
  postcode: PostCode;

  @Column({nullable: true})
  owner_id: number;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @Column({name: 'photo_url', nullable: true})
  photoUrl?: string;

  @CreateDateColumn({name: 'created_date'})
  createdDate?: Date;

  @UpdateDateColumn({name: 'updated_date'})
  updatedDate?: Date;

  @Column({name: 'deleted_date', nullable: true})
  deletedDate?: Date;

  @ManyToMany(type => User, { nullable: true })
  @JoinTable({name: 'organisation_members', joinColumn: {name: 'org_id'}, inverseJoinColumn: {name: 'user_id'}})
  members?: Category[];

  @ManyToMany(type => User, { nullable: true })
  @JoinTable({name: 'organisation_invited_users', joinColumn: {name: 'org_id'}, inverseJoinColumn: {name: 'user_id'}})
  invitedUsers?: Category[];

  @Column({name: 'partner', nullable: true, default: false})
  partner?: boolean;

  @ManyToMany(type => User, { nullable: true })
  @JoinTable({name: 'organisation_followers', joinColumn: {name: 'org_id'}, inverseJoinColumn: {name: 'user_id'}})
  followers?: User[];

  followed?: boolean;

  rating?: number;

  reviewCount?: number;

  eventsCount?: number;

  fundCount?: number;

  updateCount?: number;

  @Column({name: 'default_fund', nullable: true})
  defaultFund?: number;

  @OneToMany(type => Product, product => product.org)
  products?: Product[];

  @OneToMany(type => Review, review => review.organisation)
  review?: Review[];

  @OneToMany(type => Fund, fund => fund.organisation)
  funds?: Fund[];

  @OneToMany(type => Event, event => event.organisation)
  events?: Event[];

  @OneToMany(type => Update, update => update.organisation)
  updates?: Update[];

  @Column({nullable: true})
  location?: string;

  @OneToMany(type => OpeningHours, hour => hour.organisation, {nullable: true})
  opening?: OpeningHours[]; 

  constructor(partial: DeepPartial<Organisation>) {
    Object.assign(this, partial);
  }
}
