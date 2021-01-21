import {MigrationInterface, QueryRunner} from "typeorm";

export class eventAddFields1576062199430 implements MigrationInterface {
    name = 'eventAddFields1576062199430'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" ADD "repeatRange" character varying DEFAULT 'Day'`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "allDay" boolean DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "assain_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "isPublic" SET DEFAULT true`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_568e40e68bec7cd391e87249c91" FOREIGN KEY ("assain_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_568e40e68bec7cd391e87249c91"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "isPublic" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "assain_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "allDay"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "repeatRange"`, undefined);
    }

}
