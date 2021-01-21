import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../user/user.entity';
import { dateApplyTimeZone } from '../common/helpers/entity.helper';

@Entity()
export class Notification {
  @PrimaryColumn({type: 'uuid'})
  id: string;

  @Column()
  text: string;

  @Column({nullable: true})
  entity_id: string;

  @Column({nullable: true})
  entity: string;

  @Column({nullable: true, default: false})
  isRead: boolean;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'from_id' })
  from: User;

  @Column({nullable: true})
  icon: string;

  @Column({nullable: true})
  type: string;

  @Column({nullable: true})
  action?: string;

  @CreateDateColumn({name: 'created_date', transformer: dateApplyTimeZone})
  createdDate?: Date;
}
