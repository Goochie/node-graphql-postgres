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
import { dateApplyTimeZone } from '../common/helpers/entity.helper';
import { Community } from '../common/community/community.entity';
import { AttachType } from './dto/attach-type';

@Entity()
export class Message {
  @PrimaryColumn({type: 'uuid'})
  id: string;

  @Column()
  text: string;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'from_id' })
  from: User;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'to_id' })
  to: User;

  @Column({name: 'attach_url', nullable: true})
  attachUrl?: string;

  @Column({name: 'attach_type', nullable: true, enum: AttachType})
  attachType?: AttachType;

  @CreateDateColumn({name: 'created_date', transformer: dateApplyTimeZone})
  createdDate: Date;

  @Column({name: 'is_read', nullable: true, default: false})
  isRead: boolean;

  @ManyToOne(type => Message, { nullable: true, lazy: true })
  @JoinColumn({ name: 'react_id' })
  reactTo: Message;
}
