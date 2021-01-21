import {MigrationInterface, QueryRunner} from "typeorm";

export class addDescriptionToDocument1586420191159 implements MigrationInterface {
    name = 'addDescriptionToDocument1586420191159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_document" ADD "description" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_document" DROP COLUMN "description"`, undefined);
    }

}
