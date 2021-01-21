import {MigrationInterface, QueryRunner} from "typeorm";

export class recurringWithTimestamp1585101336837 implements MigrationInterface {
    name = 'recurringWithTimestamp1585101336837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recurring" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "recurring" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "recurring" ADD "deleted_date" TIMESTAMP`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recurring" DROP COLUMN "deleted_date"`, undefined);
        await queryRunner.query(`ALTER TABLE "recurring" DROP COLUMN "updated_date"`, undefined);
        await queryRunner.query(`ALTER TABLE "recurring" DROP COLUMN "created_date"`, undefined);
    }

}