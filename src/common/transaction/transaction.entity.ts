import {Entity, Column, PrimaryColumn, UpdateDateColumn, ManyToOne, JoinColumn, Generated, Index, Raw} from 'typeorm';
import { dateApplyTimeZone } from '../helpers/entity.helper';
import { Fund } from '../../fund/fund.entity';
import { Product } from '../../product/product.entity';
import { User } from '../../user/user.entity';

export enum TransactionType {
  PAYMENT = 'PAYMENT',
  WITHDRAW = 'WITHDRAW',
  FAIL = 'FAIL',
}

@Entity({name: 'transaction'})
export class TransactionEntity {

    @PrimaryColumn('uuid')
    @Generated('uuid')
    uuid: string;

    @Index()
    @Column({nullable: false, type: 'bigint', default:  () => "nextval('transaction_sequence')"})
    number?: number;

    @Column({nullable: true})
    stripeId: string;

    @Column({nullable: true})
    paypalId: string;

    @Column({nullable: true})
    currency: string;

    @Column({nullable: true, type: 'int'})
    amount: number;

    @Column({nullable: true, type: 'int'})
    fee: number;

    @Column({nullable: true})
    fund_id: number;

    @ManyToOne(type => Fund, { nullable: true })
    @JoinColumn({ name: 'fund_id' })
    fund?: Fund;

    @Column({nullable: true})
    user_id: number;

    @ManyToOne(type => User, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @Column({nullable: true})
    product_id: number;

    @ManyToOne(type => Product, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product?: Product;

    @UpdateDateColumn({name: 'updated_date', transformer: dateApplyTimeZone})
    updatedDate?: Date;

    @Column({nullable: true, default: false})
    ananim: boolean;

    @Column({enum: TransactionType})
    type: TransactionType;

    @Column({type: 'json', nullable: true})
    data?: any;

    @Column({type: 'boolean', default: false})
    noWithdrawal?: boolean;
}
