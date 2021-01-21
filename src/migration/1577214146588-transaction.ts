import {MigrationInterface, QueryRunner} from "typeorm";

export class transaction1577214146588 implements MigrationInterface {
    name = 'transaction1577214146588'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "transaction" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "stripeId" character varying, "paypalId" character varying, "currency" character varying, "amount" integer, "fee" integer, "fund_id" integer, "user_id" integer, "product_id" uuid, "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "ananim" boolean DEFAULT false, "type" character varying NOT NULL, CONSTRAINT "PK_fcce0ce5cc7762e90d2cc7e2307" PRIMARY KEY ("uuid"))`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_1888c1b21792f7bbbafa7fd4bfe" FOREIGN KEY ("fund_id") REFERENCES "fund"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_b4a3d92d5dde30f3ab5c34c5862" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_1801daeaeaaaef2aeb63ae80a67" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_1801daeaeaaaef2aeb63ae80a67"`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_b4a3d92d5dde30f3ab5c34c5862"`, undefined);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_1888c1b21792f7bbbafa7fd4bfe"`, undefined);
        await queryRunner.query(`DROP TABLE "transaction"`, undefined);
    }

}
