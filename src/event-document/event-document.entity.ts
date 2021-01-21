import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class EventDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  url: string;

  @ManyToOne(type => User, { nullable: true,  onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'user_id' })
  user: Partial<User>;

  @Column()
  filename: string;

  @Column()
  filesize: number;

  @Column()
  filetype: string;

  @Column({name: 'description', nullable: true})
  description?: string;
}
