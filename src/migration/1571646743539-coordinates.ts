import {MigrationInterface, QueryRunner} from "typeorm";

export class coordinates1571646743539 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "postcode" ADD "coordinates" geometry(Point,4326)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "postcode" DROP COLUMN "coordinates"`);
    }

}
