import {MigrationInterface, QueryRunner} from "typeorm";

export class eventUpdate1585601681279 implements MigrationInterface {
    name = 'eventUpdate1585601681279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_568e40e68bec7cd391e87249c91"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "assain_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "repeat"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "repeatRange"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "allDay"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "assign_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_00aac5b45e097cde3d4c90f4bc9" FOREIGN KEY ("assign_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_00aac5b45e097cde3d4c90f4bc9"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "assign_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "allDay" boolean DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "repeatRange" character varying DEFAULT 'Day'`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "repeat" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "assain_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_568e40e68bec7cd391e87249c91" FOREIGN KEY ("assain_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
