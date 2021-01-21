import {MigrationInterface, QueryRunner} from "typeorm";

export class addActonToNotification1586448986479 implements MigrationInterface {
    name = 'addActonToNotification1586448986479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "action" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "action"`, undefined);
    }

}
