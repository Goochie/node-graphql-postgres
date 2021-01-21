import {MigrationInterface, QueryRunner} from "typeorm";

export class eventGroupMultipleLink1585666465475 implements MigrationInterface {
    name = 'eventGroupMultipleLink1585666465475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_cc0c9c66eb7ef8bb3d8d5164806"`, undefined);
        await queryRunner.query(`CREATE TABLE "event_groups" ("event_id" integer NOT NULL, "group_id" integer NOT NULL, CONSTRAINT "PK_36cb9f0023189864d550249ea26" PRIMARY KEY ("event_id", "group_id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_7d7059f1110c92aa8f95bb031a" ON "event_groups" ("event_id") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_d1bd1d968af4dfcebf0b9fb254" ON "event_groups" ("group_id") `, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "group_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_groups" ADD CONSTRAINT "FK_7d7059f1110c92aa8f95bb031a3" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_groups" ADD CONSTRAINT "FK_d1bd1d968af4dfcebf0b9fb2545" FOREIGN KEY ("group_id") REFERENCES "event_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_groups" DROP CONSTRAINT "FK_d1bd1d968af4dfcebf0b9fb2545"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_groups" DROP CONSTRAINT "FK_7d7059f1110c92aa8f95bb031a3"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "group_id" integer`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_d1bd1d968af4dfcebf0b9fb254"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_7d7059f1110c92aa8f95bb031a"`, undefined);
        await queryRunner.query(`DROP TABLE "event_groups"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_cc0c9c66eb7ef8bb3d8d5164806" FOREIGN KEY ("group_id") REFERENCES "event_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
