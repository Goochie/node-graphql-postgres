import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserToStripe1572864655902 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ADD "stripe_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "stripe_id"`);
    }

}
