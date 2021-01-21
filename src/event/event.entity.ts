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
import { Organisation } from '../organisation/organisation.entity';
import { Update } from '../updates/updates.entity';
import { EventGroup } from './event-group.entity';
import { Recurring } from '../recurring/recurring.entity';
import { SchoolYear } from '../common/school-year/school-year.entity';
import { EventDocument } from '../event-document/event-document.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToMany(type => Category, { nullable: true })
  @JoinTable({name: 'event_categories', joinColumn: {name: 'event_id'}, inverseJoinColumn: {name: 'category_id'}})
  category: Category[];

  @ManyToOne(type => SchoolYear, { nullable: true })
  @JoinColumn({ name: 'schoolyear_id' })
  schoolYear?: SchoolYear;

  @ManyToOne(type => ThemeImages, { nullable: true })
  @JoinColumn({ name: 'image_id' })
  theme?: ThemeImages;

  @Column({nullable: true})
  organisation_id: number;

  @ManyToOne(type => Organisation, { nullable: true })
  @JoinColumn({ name: 'organisation_id' })
  organisation?: Organisation;

  @ManyToOne(type => PostCode, { nullable: true })
  @JoinColumn({ name: 'postcode_id' })
  postcode: PostCode;

  @Column({nullable: true})
  location: string;

  @Column({default: false})
  isOnline: boolean;

  @Column({default: true})
  isPublic: boolean;

  @Column({type: 'timestamptz'})
  startDate: Date;

  @Column({nullable: true})
  startTime: string;

  @Column({nullable: true})
  startTimeI: number;

  @Column({type: 'timestamptz', nullable: true})
  endDate: Date;

  @Column({nullable: true})
  endTime: string;

  @Column({nullable: true})
  endTimeI: number;

  @Column({nullable: true, default: 0})
  cost: number;

  @Column({nullable: true, default: 0})
  contribution: number;

  @Column({nullable: true, default: 0})
  size: number;

  @ManyToOne(type => User, { nullable: true })
  @JoinColumn({ name: 'assign_id' })
  assign?: Partial<User>;

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
  @JoinTable({name: 'event_followers', joinColumn: {name: 'event_id'}, inverseJoinColumn: {name: 'user_id'}})
  followers?: User[];

  followed?: boolean;

  follower_count: number;

  @OneToMany(type => Update, updates => updates.event)
  updates: Update[];

  updates_count: number;

  @ManyToMany(type => EventGroup, { nullable: true })
  @JoinTable({name: 'event_groups', joinColumn: {name: 'event_id'}, inverseJoinColumn: {name: 'group_id'}})
  groups: EventGroup[];

  @Column({name: 'minAge', nullable: true})
  minAge?: number;

  @Column({name: 'maxAge', nullable: true})
  maxAge?: number;

  @ManyToOne(type => Recurring, { nullable: true })
  @JoinColumn({name: 'recurring_event_id'})
  recurring: Recurring;
  
  @ManyToMany(type => EventDocument, { nullable: true })
  @JoinTable({name: 'event_documents', joinColumn: {name: 'event_id'}, inverseJoinColumn: {name: 'document_id'}})
  documents: EventDocument[];
  
  constructor(partial: DeepPartial<Event>) {
    for (const key in partial) {
      if (partial.hasOwnProperty(key)) {
        this[key] = partial[key];
      }
    }
  }
}
