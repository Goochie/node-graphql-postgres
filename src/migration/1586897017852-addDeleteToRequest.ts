import {MigrationInterface, QueryRunner} from "typeorm";

export class addDeleteToRequest1586897017852 implements MigrationInterface {
    name = 'addDeleteToRequest1586897017852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" ADD "deleted_date" TIMESTAMP`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" DROP COLUMN "deleted_date"`, undefined);
    }

}
