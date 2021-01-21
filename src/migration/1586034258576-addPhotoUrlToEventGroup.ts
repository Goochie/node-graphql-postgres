import {MigrationInterface, QueryRunner} from "typeorm";

export class addPhotoUrlToEventGroup1586034258576 implements MigrationInterface {
    name = 'addPhotoUrlToEventGroup1586034258576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_group" ADD "photo_url" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_group" DROP COLUMN "photo_url"`, undefined);
    }

}
