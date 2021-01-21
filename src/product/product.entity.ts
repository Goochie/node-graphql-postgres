import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Generated,
  OneToMany,
  JoinTable,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategoryDto } from './dto/enums/product-category';
import { Organisation } from '../organisation/organisation.entity';
import { PurchaseProduct } from '../common/product/purchase-product.entity';
import { User } from '../user/user.entity';
import { Category } from '../categories/category.entity';
import { DeliverySettings } from './delivery-setings.entity';
import { Tags } from './tags.entity';
import { Field } from 'type-graphql';
import { Review } from '../review/review.entity';
import { PostCode } from '../postcode/post-code.entity';


@Entity({name: 'product'})
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id?: string;

  @Column({name: 'name'})
  name: string;

  @Column( { nullable: true })
  description?: string;

  @Column( { nullable: true, length: 3 })
  currency?: string;

  @Column( { nullable: true })
  quantity?: number;

  @Column( { nullable: true })
  restock?: boolean;

  @Column({name: 'cost', nullable: true})
  cost?: number;

  @Column({type: 'simple-array', nullable: true, name: 'photo_urls'})
  photoUrls?: string[];

  @ManyToMany(type => Category, { nullable: true })
  @JoinTable({name: 'product_categories', joinColumn: {name: 'product_id'}, inverseJoinColumn: {name: 'category_id'}})
  category?: Category[];

  @Column({name: 'who_made', nullable: true})
  whoMade?: string;

  @Column({name: 'contribution'})
  contribution: number;

  @Column({name: 'serviceType', nullable: true, enum: ProductCategoryDto})
  serviceType: ProductCategoryDto;

  @ManyToMany(type => Tags, { nullable: true })
  @JoinTable({name: 'product_tags', joinColumn: {name: 'product_id'}, inverseJoinColumn: {name: 'tags_id'}})
  tags?: Tags[];

  @Column({name: 'org_id', nullable: true})
  org_id?: number;

  @ManyToOne(type => Organisation,  )
  @JoinColumn({ name: 'org_id' })
  org?: Partial<Organisation>;

  @Column({name: 'profile_id', nullable: true})
  profile_id?: number;

  @ManyToOne(type => User, { nullable: true })
  @JoinColumn({ name: 'profile_id' })
  profile?: Partial<User>;

  @ManyToOne(type => DeliverySettings)
  @JoinColumn({ name: 'delivery_id' })
  delivery?: Partial<DeliverySettings>;

  @OneToMany(type => PurchaseProduct, pur => pur.product )
  purchases?: PurchaseProduct[];

  @Column({ nullable: true, default: 'SERVICE' })
  itemType?: string;

  @Column({ nullable: true })
  sku?: string;

  @CreateDateColumn({name: 'created_date'})
  createdDate?: Date;

  @UpdateDateColumn({name: 'updated_date'})
  updatedDate?: Date;

  @Column({name: 'deleted_date', nullable: true})
  deletedDate?: Date;

  @Column({name: 'active', nullable: true, default: true})
  active?: boolean;

  @Column({name: 'mobility', nullable: true, default: false})
  mobility?: boolean;

  @Column({name: 'used', nullable: true, default: false})
  used?: boolean;

  @Column({name: 'privacy', nullable: true})
  privacy?: string;

  @Column({name: 'owner', nullable: true})
  owner?: string;

  @Column({name: 'price_type', nullable: true})
  price_type?: string;

  @Column({name: 'min_age', nullable: true})
  min_age?: number;

  @Column({name: 'max_age', nullable: true})
  max_age?: number;

  @Column({name: 'location', nullable: true})
  location?: string;

  @ManyToOne(type => PostCode, { nullable: true })
  @JoinColumn({ name: 'postcode_id' })
  postcode: PostCode;

  @OneToMany(type => Review, review => review.product, { nullable: true })
  review?: Review[]
}
