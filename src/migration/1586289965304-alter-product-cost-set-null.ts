import {MigrationInterface, QueryRunner} from "typeorm";

export class alterProductCostSetNull1586289965304 implements MigrationInterface {
    name = 'alterProductCostSetNull1586289965304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "cost" DROP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "cost" SET NOT NULL`, undefined);
    }

}
