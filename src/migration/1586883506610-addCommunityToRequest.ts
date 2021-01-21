import {MigrationInterface, QueryRunner} from "typeorm";

export class addCommunityToRequest1586883506610 implements MigrationInterface {
    name = 'addCommunityToRequest1586883506610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" ADD "community" character varying NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" DROP COLUMN "community"`, undefined);
    }

}
