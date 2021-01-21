import {MigrationInterface, QueryRunner} from "typeorm";

export class number1580131661372 implements MigrationInterface {
    name = 'number1580131661372'

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`CREATE SEQUENCE transaction_sequence start 933 increment 1`);
      await queryRunner.query(`ALTER TABLE "transaction" ADD "number" BIGINT NOT NULL DEFAULT nextval('transaction_sequence')`, undefined);
      await queryRunner.query(`CREATE INDEX "IDX_333c4baf4cc84d2f6c3d22b4b9" ON "transaction" ("number") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`DROP SEQUENCE transaction_sequence`);
      await queryRunner.query(`DROP INDEX "IDX_333c4baf4cc84d2f6c3d22b4b9"`, undefined);
      await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "number"`, undefined);
    }

}
