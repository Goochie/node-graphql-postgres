import {MigrationInterface, QueryRunner} from "typeorm";

export class request1586554464413 implements MigrationInterface {
    name = 'request1586554464413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "request" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "fulfilled_date" TIMESTAMP, "owner_id" integer, "volunteer_id" integer, CONSTRAINT "PK_167d324701e6867f189aed52e18" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "support_type" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "mobility" SET DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "used" SET DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "privacy"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "privacy" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "owner"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "owner" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price_type"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "price_type" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_0dc0d8afc0a15fb6c273f72af6a" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_a4607d8d5fa707b0326be26d5c1" FOREIGN KEY ("volunteer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_a4607d8d5fa707b0326be26d5c1"`, undefined);
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_0dc0d8afc0a15fb6c273f72af6a"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price_type"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "price_type" product_price_type`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "owner"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "owner" product_owner`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "privacy"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "privacy" product_privacy`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "used" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "mobility" DROP DEFAULT`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "support_type"`, undefined);
        await queryRunner.query(`DROP TABLE "request"`, undefined);
    }

}
