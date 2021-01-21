import {MigrationInterface, QueryRunner} from "typeorm";

export class ageGroups1582715079613 implements MigrationInterface {
    name = 'ageGroups1582715079613'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" ADD "minAge" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "maxAge" integer`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "maxAge"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "minAge"`, undefined);
    }

}
