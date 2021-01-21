import {MigrationInterface, QueryRunner} from "typeorm";

export class friendRequest1579089193697 implements MigrationInterface {
    name = 'friendRequest1579089193697'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "friendship" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "friendship" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "friendship" DROP COLUMN "updated_date"`, undefined);
        await queryRunner.query(`ALTER TABLE "friendship" DROP COLUMN "created_date"`, undefined);
    }

}
