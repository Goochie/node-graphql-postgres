import {MigrationInterface, QueryRunner} from "typeorm";
import { CategoryTypeDto } from "../categories/dto/category.type.dto";

import { data } from './seed-data/orgCats';
import { MigrationsHelper } from "../common/helpers/MigrationsHelper";

const cats = data;

export class newOrgCats1584590372931 implements MigrationInterface {
    name = 'newOrgCats1584590372931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "organisation_categories" WHERE true`, undefined);
        await queryRunner.query(`DELETE FROM "category" WHERE type = '${CategoryTypeDto.ORGANISATION}'`, undefined);
        await MigrationsHelper.insertRows(queryRunner, 'category', CategoryTypeDto.ORGANISATION, cats);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
