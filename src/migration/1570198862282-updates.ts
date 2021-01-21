import {MigrationInterface, QueryRunner} from "typeorm";

export class updates1570198862282 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "update" ("id" uuid NOT NULL, "text" character varying NOT NULL, "attach_url" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, "parent_id" uuid, "organisation_id" integer, "event_id" integer, "fund_id" integer, "owner_id" integer, CONSTRAINT "PK_575f77a0576d6293bc1cb752847" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "update" ADD CONSTRAINT "FK_363cace2aa19933216b8b2cd533" FOREIGN KEY ("organisation_id") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "update" ADD CONSTRAINT "FK_a6693eb184c2cfcf922063a9170" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "update" ADD CONSTRAINT "FK_03d2701f63fc8bb8ef6c0ec0338" FOREIGN KEY ("fund_id") REFERENCES "fund"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "update" ADD CONSTRAINT "FK_7ce9b8c0e1fa0b64484897f59f3" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "update" ADD CONSTRAINT "FK_e0ddb3ce679b03ca46484b467d2" FOREIGN KEY ("parent_id") REFERENCES "update"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "update" DROP CONSTRAINT "FK_e0ddb3ce679b03ca46484b467d2"`);
        await queryRunner.query(`ALTER TABLE "update" DROP CONSTRAINT "FK_7ce9b8c0e1fa0b64484897f59f3"`);
        await queryRunner.query(`ALTER TABLE "update" DROP CONSTRAINT "FK_03d2701f63fc8bb8ef6c0ec0338"`);
        await queryRunner.query(`ALTER TABLE "update" DROP CONSTRAINT "FK_a6693eb184c2cfcf922063a9170"`);
        await queryRunner.query(`ALTER TABLE "update" DROP CONSTRAINT "FK_363cace2aa19933216b8b2cd533"`);
        await queryRunner.query(`DROP TABLE "update"`);
    }

}
