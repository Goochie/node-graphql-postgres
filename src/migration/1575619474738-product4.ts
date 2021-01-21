import {MigrationInterface, QueryRunner} from "typeorm";

export class product41575619474738 implements MigrationInterface {
    name = 'product41575619474738'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "deliverysettings" ADD "reuse" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "sku" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "deliverysettings" DROP COLUMN "reuse"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "sku"`, undefined);
    }

}
