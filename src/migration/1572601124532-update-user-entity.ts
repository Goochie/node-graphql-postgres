import {MigrationInterface, QueryRunner} from "typeorm";

export class updateUserEntity1572601124532 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "email_verify_token" character varying DEFAULT 'none'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "photo_url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "photo_url"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email_verify_token"`);
    }

}
