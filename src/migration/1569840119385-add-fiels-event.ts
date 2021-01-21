import {MigrationInterface, QueryRunner} from "typeorm";

export class addFielsEvent1569840119385 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" ADD "isPublic" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "isPublic"`);
    }

}
