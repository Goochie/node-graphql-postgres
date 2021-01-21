import {MigrationInterface, QueryRunner} from "typeorm";

export class fundVote1585538924830 implements MigrationInterface {
    name = 'fundVote1585538924830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fund_voters" ("fund_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_1cf6ca01629ad26453a5ecea1ae" PRIMARY KEY ("fund_id", "user_id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_8b26da99441d3758410c1b414a" ON "fund_voters" ("fund_id") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_9dcdc39d368845138d024bc495" ON "fund_voters" ("user_id") `, undefined);
        await queryRunner.query(`ALTER TABLE "fund" ADD "vote_count" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "fund_voters" ADD CONSTRAINT "FK_8b26da99441d3758410c1b414a7" FOREIGN KEY ("fund_id") REFERENCES "fund"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "fund_voters" ADD CONSTRAINT "FK_9dcdc39d368845138d024bc495c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fund_voters" DROP CONSTRAINT "FK_9dcdc39d368845138d024bc495c"`, undefined);
        await queryRunner.query(`ALTER TABLE "fund_voters" DROP CONSTRAINT "FK_8b26da99441d3758410c1b414a7"`, undefined);
        await queryRunner.query(`ALTER TABLE "fund" DROP COLUMN "vote_count"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_9dcdc39d368845138d024bc495"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_8b26da99441d3758410c1b414a"`, undefined);
        await queryRunner.query(`DROP TABLE "fund_voters"`, undefined);
    }

}
