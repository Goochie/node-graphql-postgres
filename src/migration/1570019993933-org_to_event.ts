import {MigrationInterface, QueryRunner} from "typeorm";

export class orgToEvent1570019993933 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" ADD "organisation_id" integer`);
        await queryRunner.query(`ALTER TABLE "fund" ADD "organisation_id" integer`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_035c9a57e7f1391a44b79b6c015" FOREIGN KEY ("organisation_id") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fund" ADD CONSTRAINT "FK_ebd14275dadd18707ee623a84e9" FOREIGN KEY ("organisation_id") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "fund" DROP CONSTRAINT "FK_ebd14275dadd18707ee623a84e9"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_035c9a57e7f1391a44b79b6c015"`);
        await queryRunner.query(`ALTER TABLE "fund" DROP COLUMN "organisation_id"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "organisation_id"`);
    }

}
