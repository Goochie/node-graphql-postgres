import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Fund } from '../../fund/fund.entity';
import { User } from '../../user/user.entity';
import { StatusPurcheseENUM } from '../../product/dto/enums/status.purchese';
import { Product } from '../../product/product.entity';
import { BuyerAddress } from '../../buyeraddress/buyaddress.entity';

@Entity()
export class PurchaseProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'product_id'})
  productId: string;

  @Column({name: 'user_id'})
  userId: number;

  @ManyToOne(type => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(type => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(type => Fund)
  @JoinColumn({ name: 'fund_id' })
  fund: Fund;

  @ManyToOne(type => BuyerAddress)
  @JoinColumn({ name: 'billing_address_id' })
  buyerAddress: BuyerAddress;

  @Column({enum: StatusPurcheseENUM})
  status: StatusPurcheseENUM;

  @Column({name: 'billing_address_id'})
  billingAddressID: number;

  @Column({name: 'delivery_address_id'})
  deliveryAddressID: number;

  @Column()
  quantity: number;

  @CreateDateColumn({name: 'created_date'})
  createdDate: Date;

  @UpdateDateColumn({name: 'updated_date'})
  updatedDate: Date;
}
