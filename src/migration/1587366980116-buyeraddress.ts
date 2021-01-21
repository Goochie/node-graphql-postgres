import {MigrationInterface, QueryRunner} from "typeorm";

export class buyeraddress1587365591320 implements MigrationInterface {
    name = 'buyeraddress1587365591320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "buyer_address" ("id" SERIAL NOT NULL, "buyer_name" character varying NOT NULL, "street_addr" character varying NOT NULL, "flat_addr" character varying, "city" character varying NOT NULL, "region" character varying NOT NULL, "postcode_id" character varying NOT NULL, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, "buyer_id" integer, CONSTRAINT "PK_167ffb4f881304768b70651aa4c" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "buyer_address" ADD CONSTRAINT "FK_d418c10f56615aefadd8733dc47" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "buyer_address" DROP CONSTRAINT "FK_d418c10f56615aefadd8733dc47"`, undefined);
        await queryRunner.query(`DROP TABLE "buyer_address"`, undefined);
    }

}
