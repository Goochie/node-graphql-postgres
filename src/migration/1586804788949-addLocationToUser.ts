import {MigrationInterface, QueryRunner} from "typeorm";

export class addLocationToUser1586804788949 implements MigrationInterface {
    name = 'addLocationToUser1586804788949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "location" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "location"`, undefined);
    }

}
