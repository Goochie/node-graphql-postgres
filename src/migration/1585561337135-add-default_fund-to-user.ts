import {MigrationInterface, QueryRunner} from "typeorm";

export class addDefaultFundToUser1585561337135 implements MigrationInterface {
    name = 'addDefaultFundToUser1585561337135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "default_fund" integer`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "default_fund"`, undefined);
    }

}
