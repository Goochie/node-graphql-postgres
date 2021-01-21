import {MigrationInterface, QueryRunner} from "typeorm";

export class addDefaultFund1587117721490 implements MigrationInterface {
    name = 'addDefaultFund1587117721490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organisation" ADD "default_fund" integer`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "default_fund"`, undefined);
    }

}
