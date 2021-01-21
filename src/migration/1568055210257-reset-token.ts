import {MigrationInterface, QueryRunner} from "typeorm";

export class resetToken1568055210257 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "reset_token" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "reset_token_date" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "reset_token_date"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "reset_token"`);
    }

}
