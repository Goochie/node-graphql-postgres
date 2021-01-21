import {MigrationInterface, QueryRunner} from "typeorm";

export class addThankTitleAndMessageToFund1584948832559 implements MigrationInterface {
    name = 'addThankTitleAndMessageToFund1584948832559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fund" ADD "thank_title" character varying`, undefined);
        await queryRunner.query(`ALTER TABLE "fund" ADD "thank_message" character varying`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fund" DROP COLUMN "thank_message"`, undefined);
        await queryRunner.query(`ALTER TABLE "fund" DROP COLUMN "thank_title"`, undefined);
    }

}
