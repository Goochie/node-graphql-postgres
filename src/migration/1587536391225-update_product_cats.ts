import {MigrationInterface, QueryRunner} from "typeorm";
import { MigrationsHelper } from '../common/helpers/MigrationsHelper';
import { CategoryTypeDto } from '../categories/dto/category.type.dto';

import { data } from './seed-data/etsyCats';

const cats = data;

export class updateProductCats1587536391225 implements MigrationInterface {
    name = 'updateProductCats1587536391225'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "number" SET DEFAULT nextval('transaction_sequence')`, undefined);
        await queryRunner.query(`DELETE FROM "category" WHERE type = '${CategoryTypeDto.STORE_PRODUCT}'`, undefined);
        await MigrationsHelper.insertRows(queryRunner, 'category', CategoryTypeDto.STORE_PRODUCT, cats);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "number" SET DEFAULT nextval('transaction_sequence'`, undefined);
    }

}
