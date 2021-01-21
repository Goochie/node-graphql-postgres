import {MigrationInterface, QueryRunner} from "typeorm";

export class date1569855551821 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "startDate" TYPE TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "endDate" TYPE TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "endDate" TYPE TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "startDate" TYPE TIMESTAMP`);
    }

}
