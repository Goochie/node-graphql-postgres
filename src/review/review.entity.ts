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
import { Product } from '../product/product.entity';

@Entity()
export class Review {
  @PrimaryColumn({type: 'uuid'})
  id: string;

  @Column()
  text: string;

  @Column({nullable: true})
  organisation_id?: number;

  @ManyToOne(type => Organisation, { nullable: true })
  @JoinColumn({ name: 'organisation_id' })
  organisation?: Organisation;

  @Column({nullable: true})
  community_id?: number;

  @ManyToOne(type => Community, { nullable: true })
  @JoinColumn({ name: 'community_id' })
  community?: Community;

  @Column({nullable: true})
  rating?: number;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'owner_id' })
  user: User;

  @CreateDateColumn({name: 'created_date', transformer: dateApplyTimeZone})
  createdDate: Date;

  @UpdateDateColumn({name: 'reviewd_date', transformer: dateApplyTimeZone})
  @Column({name: 'deleted_date', nullable: true})
  deletedDate?: Date;

  @Column({ nullable: true })
  parent_id: string;

  @ManyToOne(type => Review, { nullable: true, lazy: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Review;

  children_count?: number;

  @Column({nullable: true})
  product_id?: number;

  @ManyToOne(type => Product, { nullable: true, lazy: true })
  @JoinColumn({ name: 'product_id' })
  product?: Product;
}
