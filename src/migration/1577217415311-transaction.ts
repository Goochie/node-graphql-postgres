import {MigrationInterface, QueryRunner} from "typeorm";

export class transaction1577217415311 implements MigrationInterface {
    name = 'transaction1577217415311'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "billingAddress" character varying DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "billingName" character varying DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "defaultPayment" character varying DEFAULT ''`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "defaultPayment"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "billingName"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "billingAddress"`, undefined);
    }

}
