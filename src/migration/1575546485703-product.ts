import {MigrationInterface, QueryRunner} from "typeorm";

export class product1575546485703 implements MigrationInterface {
    name = 'product1575546485703'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "deliverysettings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dispatch" character varying NOT NULL, "processing" character varying NOT NULL, "mailClass" character varying NOT NULL, "carrier" character varying NOT NULL, "charge" character varying NOT NULL, "postageCost" character varying NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_829d36cd9097bbfae84c6330d1f" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "product_tag" ("id" SERIAL NOT NULL, "tag" character varying NOT NULL, CONSTRAINT "UTag" UNIQUE ("tag"), CONSTRAINT "PK_1439455c6528caa94fcc8564fda" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "product_categories" ("product_id" uuid NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_54f2e1dbf14cfa770f59f0aac8f" PRIMARY KEY ("product_id", "category_id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_8748b4a0e8de6d266f2bbc877f" ON "product_categories" ("product_id") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_9148da8f26fc248e77a387e311" ON "product_categories" ("category_id") `, undefined);
        await queryRunner.query(`CREATE TABLE "product_tags" ("product_id" uuid NOT NULL, "tags_id" integer NOT NULL, CONSTRAINT "PK_4a9fc77dda963c840e912527a3f" PRIMARY KEY ("product_id", "tags_id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_5b0c6fc53c574299ecc7f9ee22" ON "product_tags" ("product_id") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_656027ddfc400da74ad79c8c8e" ON "product_tags" ("tags_id") `, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" RENAME COLUMN "category" TO "serviceType"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD "description" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD "currency" character varying(3)`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD "quantity" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD "restock" boolean`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD "photo_urls" text`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD "who_made" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD "profile_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD "deleted_date" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD "delivery_id" uuid`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP CONSTRAINT "FK_656d8c2cd6b2ad7ea0f1d902478"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ALTER COLUMN "org_id" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "deliverysettings" ADD CONSTRAINT "FK_cf01f4d5f29f0be29a3f95c5989" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD CONSTRAINT "FK_656d8c2cd6b2ad7ea0f1d902478" FOREIGN KEY ("org_id") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD CONSTRAINT "FK_fc2dc6c0268a2f6ecfad30a2e08" FOREIGN KEY ("profile_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD CONSTRAINT "FK_8d522f1697132d8e10f4cfff9ea" FOREIGN KEY ("delivery_id") REFERENCES "deliverysettings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_8748b4a0e8de6d266f2bbc877f6" FOREIGN KEY ("product_id") REFERENCES "organisation_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD CONSTRAINT "FK_9148da8f26fc248e77a387e3112" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "product_tags" ADD CONSTRAINT "FK_5b0c6fc53c574299ecc7f9ee22e" FOREIGN KEY ("product_id") REFERENCES "organisation_product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "product_tags" ADD CONSTRAINT "FK_656027ddfc400da74ad79c8c8e7" FOREIGN KEY ("tags_id") REFERENCES "product_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_tags" DROP CONSTRAINT "FK_656027ddfc400da74ad79c8c8e7"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_tags" DROP CONSTRAINT "FK_5b0c6fc53c574299ecc7f9ee22e"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_9148da8f26fc248e77a387e3112"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP CONSTRAINT "FK_8748b4a0e8de6d266f2bbc877f6"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP CONSTRAINT "FK_8d522f1697132d8e10f4cfff9ea"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP CONSTRAINT "FK_fc2dc6c0268a2f6ecfad30a2e08"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP CONSTRAINT "FK_656d8c2cd6b2ad7ea0f1d902478"`, undefined);
        await queryRunner.query(`ALTER TABLE "deliverysettings" DROP CONSTRAINT "FK_cf01f4d5f29f0be29a3f95c5989"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ALTER COLUMN "org_id" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD CONSTRAINT "FK_656d8c2cd6b2ad7ea0f1d902478" FOREIGN KEY ("org_id") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP COLUMN "delivery_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP COLUMN "deleted_date"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP COLUMN "updated_date"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP COLUMN "created_date"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP COLUMN "profile_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP COLUMN "serviceType"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP COLUMN "who_made"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP COLUMN "photo_urls"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP COLUMN "restock"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP COLUMN "quantity"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP COLUMN "currency"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" DROP COLUMN "description"`, undefined);
        await queryRunner.query(`ALTER TABLE "organisation_product" ADD "category" character varying NOT NULL`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_656027ddfc400da74ad79c8c8e"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5b0c6fc53c574299ecc7f9ee22"`, undefined);
        await queryRunner.query(`DROP TABLE "product_tags"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_9148da8f26fc248e77a387e311"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_8748b4a0e8de6d266f2bbc877f"`, undefined);
        await queryRunner.query(`DROP TABLE "product_categories"`, undefined);
        await queryRunner.query(`DROP TABLE "product_tag"`, undefined);
        await queryRunner.query(`DROP TABLE "deliverysettings"`, undefined);
    }

}
