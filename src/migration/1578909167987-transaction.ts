import {MigrationInterface, QueryRunner} from "typeorm";

export class transaction1578909167987 implements MigrationInterface {
    name = 'transaction1578909167987'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "data" json`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "noWithdrawal" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeUserId" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeAuthToken" SET DEFAULT null`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeAuthRefreshToken" SET DEFAULT null`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeAuthRefreshToken" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeAuthToken" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "stripeUserId" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "noWithdrawal"`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "data"`, undefined);
    }

}
