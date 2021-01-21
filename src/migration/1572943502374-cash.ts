import {MigrationInterface, QueryRunner} from "typeorm";

export class cash1572943502374 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "fund" ADD "raised" integer`);
        await queryRunner.query(`ALTER TABLE "fund" ADD "raised_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "fund" ADD "payout" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "fund" DROP COLUMN "payout"`);
        await queryRunner.query(`ALTER TABLE "fund" DROP COLUMN "raised_date"`);
        await queryRunner.query(`ALTER TABLE "fund" DROP COLUMN "raised"`);
    }

}
