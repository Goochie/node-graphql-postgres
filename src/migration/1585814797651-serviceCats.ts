import {MigrationInterface, QueryRunner} from "typeorm";
import { MigrationsHelper } from '../common/helpers/MigrationsHelper';
import { CategoryTypeDto } from '../categories/dto/category.type.dto';

import { data } from './seed-data/serviceCats';

const cats = data;

export class serviceCats1585814797651 implements MigrationInterface {
    name = 'serviceCats1585814797651'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DELETE FROM "category" WHERE type = '${CategoryTypeDto.SERVICE}'`, undefined);
        await MigrationsHelper.insertRows(queryRunner, 'category', CategoryTypeDto.SERVICE, cats);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DELETE FROM "category" WHERE type = '${CategoryTypeDto.SERVICE}'`, undefined);
    }

}
