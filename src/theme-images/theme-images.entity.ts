import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class ThemeImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  url: string;

  @Column({default: false})
  isSquare: boolean;

  @ManyToOne(type => User, { nullable: true,  onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'user_id' })
  user: Partial<User>;
}
