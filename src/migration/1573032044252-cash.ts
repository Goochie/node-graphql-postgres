import {MigrationInterface, QueryRunner} from "typeorm";

export class cash1573032044252 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "cash" ("key" character varying NOT NULL, "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "data" json, CONSTRAINT "PK_bd8913f354fdc6e4257dd2a8363" PRIMARY KEY ("key"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "cash"`);
    }

}
