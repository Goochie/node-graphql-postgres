import {MigrationInterface, QueryRunner} from "typeorm";

export class user1567674611328 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
        await queryRunner.query(`CREATE TABLE "user"
          ("id" SERIAL NOT NULL,
           "username" character varying NOT NULL,
           "email" character varying(100) NOT NULL,
           "password_hash" character varying NOT NULL,
           "mobile" character varying(20) NOT NULL,
           "postcode" character varying(20) NOT NULL,
           CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
