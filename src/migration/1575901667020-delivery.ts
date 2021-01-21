import {MigrationInterface, QueryRunner} from "typeorm";

export class delivery1575901667020 implements MigrationInterface {
    name = 'delivery1575901667020'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "deliverysettings" DROP COLUMN "dispatch"`, undefined);
        await queryRunner.query(`ALTER TABLE "deliverysettings" DROP COLUMN "mailClass"`, undefined);
        await queryRunner.query(`ALTER TABLE "deliverysettings" DROP COLUMN "carrier"`, undefined);
        await queryRunner.query(`ALTER TABLE "deliverysettings" DROP COLUMN "postageCost"`, undefined);
        await queryRunner.query(`ALTER TABLE "deliverysettings" ADD "days" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "deliverysettings" ADD "cost" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "deliverysettings" ADD "additional" integer`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "deliverysettings" DROP COLUMN "additional"`, undefined);
        await queryRunner.query(`ALTER TABLE "deliverysettings" DROP COLUMN "cost"`, undefined);
        await queryRunner.query(`ALTER TABLE "deliverysettings" DROP COLUMN "days"`, undefined);
        await queryRunner.query(`ALTER TABLE "deliverysettings" ADD "postageCost" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "deliverysettings" ADD "carrier" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "deliverysettings" ADD "mailClass" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "deliverysettings" ADD "dispatch" character varying NOT NULL`, undefined);
    }

}
