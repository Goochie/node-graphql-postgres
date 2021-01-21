import {MigrationInterface, QueryRunner} from "typeorm";

export class stripeConnect1578652917980 implements MigrationInterface {
    name = 'stripeConnect1578652917980'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "stripeUserId" character varying DEFAULT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "stripeAuthToken" character varying DEFAULT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "stripeAuthRefreshToken" character varying DEFAULT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "stripeAuthRefreshToken"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "stripeAuthToken"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "stripeUserId"`, undefined);
    }

}
