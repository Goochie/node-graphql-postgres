import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { User } from '../user/user.entity';
import { Coordinates } from './dto/post-code';

@Entity({name: 'postcode'})
export class PostCode {
    @PrimaryGeneratedColumn()
    id?: number;

    @Index({unique: true})
    @Column()
    postcode: string;

    @Column({name: 'community_id'})
    communityId: string;

    @OneToMany(type => User, user => user.postcode, {nullable: true})
    users?: User[];

    @Column({
      type: 'geometry',
      nullable: true,
      spatialFeatureType: 'Point',
      srid: 4326,
    } )
    coordinates!: Coordinates;

    constructor(partial: Partial<PostCode>) {
      Object.assign(this, partial);
    }
}
