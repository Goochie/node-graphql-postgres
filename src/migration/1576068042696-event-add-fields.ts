import {MigrationInterface, QueryRunner} from "typeorm";

export class eventAddFields1576068042696 implements MigrationInterface {
    name = 'eventAddFields1576068042696'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" ADD "cost" integer DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "contribution" integer DEFAULT 0`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "size" integer DEFAULT 0`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "size"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "contribution"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "cost"`, undefined);
    }

}
