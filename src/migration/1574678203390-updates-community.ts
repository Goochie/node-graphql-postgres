import {MigrationInterface, QueryRunner} from "typeorm";

export class updatesCommunity1574678203390 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "update" ADD "community_id" character varying`);
        await queryRunner.query(`ALTER TABLE "update" ADD CONSTRAINT "FK_733e0e45e8e369d56a4771ab130" FOREIGN KEY ("community_id") REFERENCES "community"("community_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "update" DROP CONSTRAINT "FK_733e0e45e8e369d56a4771ab130"`);
        await queryRunner.query(`ALTER TABLE "update" DROP COLUMN "community_id"`);
    }

}
