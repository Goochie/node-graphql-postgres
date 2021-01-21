import {MigrationInterface, QueryRunner} from "typeorm";

export class addStatusToUser1583729151999 implements MigrationInterface {
    name = 'addStatusToUser1583729151999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "userStatus" character varying DEFAULT ''`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userStatus"`, undefined);
    }

}
