import {MigrationInterface, QueryRunner} from "typeorm";

export class profile1575383018504 implements MigrationInterface {
    name = 'profile1575383018504'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user_followers" ("profile_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_7c95c4b87920ae095741f5963dc" PRIMARY KEY ("profile_id", "user_id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_e558f23d10bb619eede072522d" ON "user_followers" ("profile_id") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a59d62cda8101214445e295cdc" ON "user_followers" ("user_id") `, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "public" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "bio" character varying DEFAULT ''`, undefined);
        await queryRunner.query(`ALTER TABLE "update" ADD "user_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "update" ADD CONSTRAINT "FK_06c9f7791ef57109517c6d045e1" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_followers" ADD CONSTRAINT "FK_e558f23d10bb619eede072522dc" FOREIGN KEY ("profile_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_followers" ADD CONSTRAINT "FK_a59d62cda8101214445e295cdc8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_followers" DROP CONSTRAINT "FK_a59d62cda8101214445e295cdc8"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_followers" DROP CONSTRAINT "FK_e558f23d10bb619eede072522dc"`, undefined);
        await queryRunner.query(`ALTER TABLE "update" DROP CONSTRAINT "FK_06c9f7791ef57109517c6d045e1"`, undefined);
        await queryRunner.query(`ALTER TABLE "update" DROP COLUMN "user_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "public"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_a59d62cda8101214445e295cdc"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_e558f23d10bb619eede072522d"`, undefined);
        await queryRunner.query(`DROP TABLE "user_followers"`, undefined);
    }

}
