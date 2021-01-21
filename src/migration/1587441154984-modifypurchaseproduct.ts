import {MigrationInterface, QueryRunner} from "typeorm";

export class modifypurchaseproduct1587441154984 implements MigrationInterface {
    name = 'modifypurchaseproduct1587441154984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase_product" ADD "id" SERIAL NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP CONSTRAINT "PK_547b8363f7a67f9e1972bc7b143"`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" ADD CONSTRAINT "PK_4c9bc9b4e733490bc47627dc4f2" PRIMARY KEY ("id")`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" ADD "billing_address_id" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" ADD "delivery_address_id" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" ADD "quantity" integer NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP CONSTRAINT "FK_5de05b42aeedcd8565a7f1061e7"`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP CONSTRAINT "FK_321a2949b63a96b88357a9be446"`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP CONSTRAINT "PK_4c9bc9b4e733490bc47627dc4f2"`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" ADD CONSTRAINT "FK_5de05b42aeedcd8565a7f1061e7" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" ADD CONSTRAINT "FK_321a2949b63a96b88357a9be446" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" ADD CONSTRAINT "FK_6c9dbb3d1bbf983e6d9a5fe1cdd" FOREIGN KEY ("billing_address_id") REFERENCES "buyer_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP CONSTRAINT "FK_6c9dbb3d1bbf983e6d9a5fe1cdd"`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP CONSTRAINT "FK_321a2949b63a96b88357a9be446"`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP CONSTRAINT "FK_5de05b42aeedcd8565a7f1061e7"`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP CONSTRAINT "PK_70f3fd21152b586eb4ceae61c43"`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP COLUMN "quantity"`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP COLUMN "delivery_address_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP COLUMN "billing_address_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP CONSTRAINT "PK_4c9bc9b4e733490bc47627dc4f2"`, undefined);
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP COLUMN "id"`, undefined);
    }

}
