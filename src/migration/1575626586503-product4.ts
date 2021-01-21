import {MigrationInterface, QueryRunner} from "typeorm";

export class product41575626586503 implements MigrationInterface {
    name = 'product41575626586503'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "serviceType" DROP NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "serviceType" SET NOT NULL`, undefined);
    }

}
