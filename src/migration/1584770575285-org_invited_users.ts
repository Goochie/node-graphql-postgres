import {MigrationInterface, QueryRunner} from "typeorm";

export class orgInvitedUsers1584770575285 implements MigrationInterface {
    name = 'orgInvitedUsers1584770575285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organisation_invited_users" ("org_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_84bc69adcaf5a2e45ef51445689" PRIMARY KEY ("org_id", "user_id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_42945b02803b9bbe090d8eb546" ON "organisation_invited_users" ("org_id") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_f88bdc1a0f94a1eb65d5162d82" ON "organisation_invited_users" ("user_id") `, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_invited_users" ADD CONSTRAINT "FK_42945b02803b9bbe090d8eb546d" FOREIGN KEY ("org_id") REFERENCES "organisation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_invited_users" ADD CONSTRAINT "FK_f88bdc1a0f94a1eb65d5162d826" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organisation_invited_users" DROP CONSTRAINT "FK_f88bdc1a0f94a1eb65d5162d826"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_invited_users" DROP CONSTRAINT "FK_42945b02803b9bbe090d8eb546d"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_f88bdc1a0f94a1eb65d5162d82"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_42945b02803b9bbe090d8eb546"`, undefined);
        await queryRunner.query(`DROP TABLE "organisation_invited_users"`, undefined);
    }

}
