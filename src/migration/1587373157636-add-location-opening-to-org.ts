import {MigrationInterface, QueryRunner} from "typeorm";

export class addLocationOpeningToOrg1587373157636 implements MigrationInterface {
    name = 'addLocationOpeningToOrg1587373157636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "opening_hours" ("id" SERIAL NOT NULL, "day" integer NOT NULL, "startTime" character varying NOT NULL, "endTime" character varying NOT NULL, "org_id" integer, CONSTRAINT "PK_09415e2b345103b1f5971464f85" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation" ADD "location" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "opening_hours" ADD CONSTRAINT "FK_c4747a07f4525d5fba4f0367628" FOREIGN KEY ("org_id") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "opening_hours" DROP CONSTRAINT "FK_c4747a07f4525d5fba4f0367628"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "location"`, undefined);
        await queryRunner.query(`DROP TABLE "opening_hours"`, undefined);
    }

}
