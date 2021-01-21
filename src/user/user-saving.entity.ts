import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field} from 'type-graphql';
import { PostCode } from '../postcode/post-code.entity';
import { User } from './user.entity';
import { HouseType } from './dto/house-type';

@Entity({name: 'user_saving'})
export class UserSaving {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({type: 'integer'})
    rooms: number;

    @Column({enum: HouseType})
    type: HouseType;
}
