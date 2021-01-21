import {MigrationInterface, QueryRunner} from "typeorm";

export class alterProductChangePostcode1587113938326 implements MigrationInterface {
    name = 'alterProductChangePostcode1587113938326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "postcode"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "postcode_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "number" SET DEFAULT nextval('transaction_sequence')`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_e0b81b577b8b0ddf6d337e245f7" FOREIGN KEY ("postcode_id") REFERENCES "postcode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_e0b81b577b8b0ddf6d337e245f7"`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "number" SET DEFAULT nextval('transaction_sequence')`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "postcode_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "postcode" character varying`, undefined);
    }

}
