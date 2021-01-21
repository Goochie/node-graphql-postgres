import {MigrationInterface, QueryRunner} from "typeorm";

export class product1575569696510 implements MigrationInterface {
    name = 'product1575569696510'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD "itemType" character varying DEFAULT 'SERVICE'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP COLUMN "itemType"`, undefined);
    }

}
