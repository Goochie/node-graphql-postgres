import {MigrationInterface, QueryRunner} from "typeorm";

export class orgMembers1584385312036 implements MigrationInterface {
    name = 'orgMembers1584385312036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organisation_members" ("org_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_b17e12c1c362c962d717f59178b" PRIMARY KEY ("org_id", "user_id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_23c9bea2f0c42e33fa5f026fc2" ON "organisation_members" ("org_id") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_6d808506119822a1e47422b512" ON "organisation_members" ("user_id") `, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_members" ADD CONSTRAINT "FK_23c9bea2f0c42e33fa5f026fc2b" FOREIGN KEY ("org_id") REFERENCES "organisation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_members" ADD CONSTRAINT "FK_6d808506119822a1e47422b512a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organisation_members" DROP CONSTRAINT "FK_6d808506119822a1e47422b512a"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_members" DROP CONSTRAINT "FK_23c9bea2f0c42e33fa5f026fc2b"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_6d808506119822a1e47422b512"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_23c9bea2f0c42e33fa5f026fc2"`, undefined);
        await queryRunner.query(`DROP TABLE "organisation_members"`, undefined);
    }

}
