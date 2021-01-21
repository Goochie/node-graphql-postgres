import {MigrationInterface, QueryRunner} from "typeorm";
import { CategoryTypeDto } from "../categories/dto/category.type.dto";

import { data } from './seed-data/orgCats';
import { MigrationsHelper } from "../common/helpers/MigrationsHelper";

const cats = data;

export class updateOrgCats1587482708172 implements MigrationInterface {
    name = 'updateOrgCats1587482708172'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "number" SET DEFAULT nextval('transaction_sequence')`, undefined);
        await queryRunner.query(`DELETE FROM "category" WHERE type = '${CategoryTypeDto.ORGANISATION}'`, undefined);
        await MigrationsHelper.insertRows(queryRunner, 'category', CategoryTypeDto.ORGANISATION, cats);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "number" SET DEFAULT nextval('transaction_sequence'`, undefined);
    }

}
