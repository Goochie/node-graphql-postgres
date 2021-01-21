import {MigrationInterface, QueryRunner} from "typeorm";

export class userMobileNullable1568135166880 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "mobile" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "mobile" SET NOT NULL`);
    }

}
