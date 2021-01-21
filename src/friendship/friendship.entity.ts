import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field} from 'type-graphql';
import { PostCode } from '../postcode/post-code.entity';
import { FriendshipStatus } from './friendship.status';
import { User } from '../user/user.entity';

@Entity({name: 'friendship'})
export class Friendship {
  @Column('enum', {enum: FriendshipStatus, default: FriendshipStatus.REQUEST})
  status: FriendshipStatus;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @PrimaryColumn({name: 'user_id'})
  userId: number;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'friend_id' })
  friend: User;

  @PrimaryColumn({name: 'friend_id'})
  friendId: number;

  @CreateDateColumn({name: 'created_date'})
  createdDate: Date;

  @UpdateDateColumn({name: 'updated_date'})
  updatedDate: Date;
}
