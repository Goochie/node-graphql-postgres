import {MigrationInterface, QueryRunner} from "typeorm";

export class partners1573646813828 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "purchase_product" ("product_id" uuid NOT NULL, "user_id" integer NOT NULL, "status" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "fund_id" integer, CONSTRAINT "PK_547b8363f7a67f9e1972bc7b143" PRIMARY KEY ("product_id", "user_id"))`);
        await queryRunner.query(`CREATE TABLE "organisation_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "cost" integer NOT NULL, "contribution" integer NOT NULL, "category" character varying NOT NULL, "org_id" integer NOT NULL, CONSTRAINT "PK_1efe53ee208a71527c14437e150" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD "partner" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "purchase_product" ADD CONSTRAINT "FK_5de05b42aeedcd8565a7f1061e7" FOREIGN KEY ("product_id") REFERENCES "organisation_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_product" ADD CONSTRAINT "FK_321a2949b63a96b88357a9be446" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_product" ADD CONSTRAINT "FK_06688fab928cc850f375760bc4d" FOREIGN KEY ("fund_id") REFERENCES "fund"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD CONSTRAINT "FK_656d8c2cd6b2ad7ea0f1d902478" FOREIGN KEY ("org_id") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP CONSTRAINT "FK_656d8c2cd6b2ad7ea0f1d902478"`);
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP CONSTRAINT "FK_06688fab928cc850f375760bc4d"`);
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP CONSTRAINT "FK_321a2949b63a96b88357a9be446"`);
        await queryRunner.query(`ALTER TABLE "purchase_product" DROP CONSTRAINT "FK_5de05b42aeedcd8565a7f1061e7"`);
        await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "partner"`);
        await queryRunner.query(`DROP TABLE "organisation_product"`);
        await queryRunner.query(`DROP TABLE "purchase_product"`);
    }

}
