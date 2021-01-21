import {MigrationInterface, QueryRunner} from "typeorm";

export class recurring1585087132668 implements MigrationInterface {
    name = 'recurring1585087132668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recurring" ("id" SERIAL NOT NULL, "repeatMode" integer NOT NULL, "endMode" integer NOT NULL, "endDate" character varying, "countDays" integer, "repeatDays" character varying, "monthlyOption" integer, "repeatDate" integer, "repeatPos" integer, "repeatDay" integer, CONSTRAINT "PK_acc6dc70e758d53730436620b79" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "recurring_event_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_1bc3437d78c3a020dedaa42cb73" FOREIGN KEY ("recurring_event_id") REFERENCES "recurring"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_1bc3437d78c3a020dedaa42cb73"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "recurring_event_id"`, undefined);
        await queryRunner.query(`DROP TABLE "recurring"`, undefined);
    }

}