import {MigrationInterface, QueryRunner} from "typeorm";

export class productActive1575645355186 implements MigrationInterface {
    name = 'productActive1575645355186'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" ADD "active" boolean`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "active" SET DEFAULT true`, undefined);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "active"`, undefined);
    }

}
