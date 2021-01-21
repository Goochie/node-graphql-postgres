import {MigrationInterface, QueryRunner} from "typeorm";

export class followers1569518753795 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "organisation_followers" ("org_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_c0e4fafcc6b2b1deae68bbb181a" PRIMARY KEY ("org_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cd9eee9c371a07cfa7eaa27132" ON "organisation_followers" ("org_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e2957a3237cd17df7a691f4625" ON "organisation_followers" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "organisation_followers" ADD CONSTRAINT "FK_cd9eee9c371a07cfa7eaa271326" FOREIGN KEY ("org_id") REFERENCES "organisation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_followers" ADD CONSTRAINT "FK_e2957a3237cd17df7a691f4625a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organisation_followers" DROP CONSTRAINT "FK_e2957a3237cd17df7a691f4625a"`);
        await queryRunner.query(`ALTER TABLE "organisation_followers" DROP CONSTRAINT "FK_cd9eee9c371a07cfa7eaa271326"`);
        await queryRunner.query(`DROP INDEX "IDX_e2957a3237cd17df7a691f4625"`);
        await queryRunner.query(`DROP INDEX "IDX_cd9eee9c371a07cfa7eaa27132"`);
        await queryRunner.query(`DROP TABLE "organisation_followers"`);
    }

}
