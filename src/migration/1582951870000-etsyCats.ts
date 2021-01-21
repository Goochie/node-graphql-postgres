import {MigrationInterface, QueryRunner} from "typeorm";
import { MigrationsHelper } from '../common/helpers/MigrationsHelper';
import { CategoryTypeDto } from '../categories/dto/category.type.dto';

import { data } from './seed-data/etsyCats';

const cats = data;

export class etsyCats1582951870000 implements MigrationInterface {
    name = 'etsyCats1582951870000'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DELETE FROM "product_categories" WHERE true`, undefined);
        await queryRunner.query(`DELETE FROM "category" WHERE type = '${CategoryTypeDto.STORE_PRODUCT}'`, undefined);
        await MigrationsHelper.insertRows(queryRunner, 'category', CategoryTypeDto.STORE_PRODUCT, cats);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {

    }

}
