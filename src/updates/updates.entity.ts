import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

import { User } from '../user/user.entity';
import { Organisation } from '../organisation/organisation.entity';
import { Event } from '../event/event.entity';
import { Fund } from '../fund/fund.entity';
import { dateApplyTimeZone } from '../common/helpers/entity.helper';
import { Community } from '../common/community/community.entity';

@Entity()
export class Update {
  @PrimaryColumn({type: 'uuid'})
  id: string;

  @Column()
  text: string;

  @Column({nullable: true})
  community_id: string;

  @ManyToOne(type => Community, { nullable: true })
  @JoinColumn({ name: 'community_id' })
  community?: Community;

  @Column({nullable: true})
  user_id: number;
  @ManyToOne(type => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  toUser: User;

  @Column({nullable: true})
  organisation_id: number;

  @ManyToOne(type => Organisation, { nullable: true })
  @JoinColumn({ name: 'organisation_id' })
  organisation?: Organisation;

  @Column({nullable: true})
  event_id: number;

  @ManyToOne(type => Event, { nullable: true })
  @JoinColumn({ name: 'event_id' })
  event?: Event;

  @Column({nullable: true})
  fund_id: number;

  @ManyToOne(type => Fund, { nullable: true })
  @JoinColumn({ name: 'fund_id' })
  fund?: Fund;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'owner_id' })
  user: User;

  @Column({name: 'attach_url', nullable: true})
  attachUrl?: string;

  @CreateDateColumn({name: 'created_date', transformer: dateApplyTimeZone})
  createdDate?: Date;

  @UpdateDateColumn({name: 'updated_date', transformer: dateApplyTimeZone})
  updatedDate?: Date;

  @Column({name: 'deleted_date', nullable: true})
  deletedDate?: Date;

  @Column({ nullable: true })
  parent_id: string;

  @ManyToOne(type => Update, { nullable: true, lazy: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Update;

  children_count?: number;
}
