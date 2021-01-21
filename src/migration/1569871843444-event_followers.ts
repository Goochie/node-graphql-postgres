import {MigrationInterface, QueryRunner} from "typeorm";

export class eventFollowers1569871843444 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "event_followers" ("event_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_c7ebe40fd97f7c88611d101e1e6" PRIMARY KEY ("event_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_83b6c8dc9d1487b6b1281371c0" ON "event_followers" ("event_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e018514514f92f12b10f080d5b" ON "event_followers" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "event_followers" ADD CONSTRAINT "FK_83b6c8dc9d1487b6b1281371c0c" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_followers" ADD CONSTRAINT "FK_e018514514f92f12b10f080d5b4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_followers" DROP CONSTRAINT "FK_e018514514f92f12b10f080d5b4"`);
        await queryRunner.query(`ALTER TABLE "event_followers" DROP CONSTRAINT "FK_83b6c8dc9d1487b6b1281371c0c"`);
        await queryRunner.query(`DROP INDEX "IDX_e018514514f92f12b10f080d5b"`);
        await queryRunner.query(`DROP INDEX "IDX_83b6c8dc9d1487b6b1281371c0"`);
        await queryRunner.query(`DROP TABLE "event_followers"`);
    }

}
