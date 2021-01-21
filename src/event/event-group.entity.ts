import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  OneToMany,
  DeepPartial,
} from 'typeorm';

import { ThemeImages } from '../theme-images/theme-images.entity';
import { Category } from '../categories/category.entity';
import { User } from '../user/user.entity';
import { PostCode } from '../postcode/post-code.entity';
import { Organisation } from '../organisation/organisation.entity';
import { Event } from './event.entity';

@Entity()
export class EventGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToMany(type => Category, { nullable: true })
  @JoinTable({name: 'event_group_categories', joinColumn: {name: 'event_group_id'}, inverseJoinColumn: {name: 'category_id'}})
  category: Category[];

  @ManyToOne(type => ThemeImages, { nullable: true })
  @JoinColumn({ name: 'image_id' })
  theme?: ThemeImages;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @Column({name: 'photo_url', nullable: true})
  photoUrl?: string;

  @ManyToOne(type => Organisation, { nullable: true })
  @JoinColumn({ name: 'organisation_id' })
  organisation?: Organisation;

  @ManyToOne(type => PostCode, { nullable: true })
  @JoinColumn({ name: 'postcode_id' })
  postcode: PostCode;

  @ManyToOne(type => User, { nullable: true })
  @JoinColumn({ name: 'assign_id' })
  assign?: Partial<User>;

  @Column({nullable: true})
  cost: number;

  @Column({nullable: true})
  seats: number;

  @ManyToMany(type => Event, { nullable: true })
  @JoinTable({name: 'event_groups', joinColumn: {name: 'group_id'}, inverseJoinColumn: {name: 'event_id'}})
  events: Event[];

  @CreateDateColumn({name: 'created_date'})
  createdDate: Date;

  @UpdateDateColumn({name: 'updated_date'})
  updatedDate: Date;

  @Column({name: 'deleted_date', nullable: true})
  deletedDate?: Date;
  
  constructor(partial: DeepPartial<Event>) {
    for (const key in partial) {
      if (partial.hasOwnProperty(key)) {
        this[key] = partial[key];
      }
    }
  }
}
