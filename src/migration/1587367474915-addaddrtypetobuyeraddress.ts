import {MigrationInterface, QueryRunner} from "typeorm";

export class addaddrtypetobuyeraddress1587367474915 implements MigrationInterface {
    name = 'addaddrtypetobuyeraddress1587367474915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "buyer_address" ADD "address_type" integer NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "buyer_address" DROP COLUMN "address_type"`, undefined);
    }

}
