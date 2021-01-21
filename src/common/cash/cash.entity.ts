import {Entity, Column, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import { dateApplyTimeZone } from '../helpers/entity.helper';

@Entity({name: 'cash'})
export class CashEntity {

    @PrimaryColumn()
    key: string;

    @UpdateDateColumn({name: 'updated_date', transformer: dateApplyTimeZone})
    updatedDate?: Date;

    @Column({nullable: true, type: 'json'})
    data: any;
}