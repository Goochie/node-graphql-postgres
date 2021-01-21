import {MigrationInterface, QueryRunner} from "typeorm";

export class alterProducts1586243485527 implements MigrationInterface {
    name = 'alterProducts1586243485527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "product_privacy" AS ENUM('PRIVATE', 'PUBLIC')`);
        await queryRunner.query(`CREATE TYPE "product_owner" AS ENUM('PROFILE', 'ORGANISATION')`);
        await queryRunner.query(`CREATE TYPE "product_price_type" AS ENUM('FIXED', 'PERHOUR', 'NONE')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "used" boolean`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "mobility" boolean`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "privacy" "product_privacy"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "owner" "product_owner"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "price_type" "product_price_type"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "min_age" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "max_age" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "location" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "postcode" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price_type"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "owner"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "privacy"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "mobility"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "used"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "min_age"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "max_age"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "location" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "postcode" integer`, undefined);
        await queryRunner.query(`DROP TYPE "product_price_type"`);
        await queryRunner.query(`DROP TYPE "product_owner"`);
        await queryRunner.query(`DROP TYPE "product_privacy"`);
    }

}
