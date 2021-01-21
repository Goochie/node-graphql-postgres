import {MigrationInterface, QueryRunner} from "typeorm";

export class alterProduct1586501761184 implements MigrationInterface {
    name = 'alterProduct1586501761184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "owner"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "owner" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "owner"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "owner" product_owner`, undefined);
    }

}
