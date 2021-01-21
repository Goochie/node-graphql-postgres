import {MigrationInterface, QueryRunner} from "typeorm";

export class postCode1567845218603 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "postcode" ("id" SERIAL NOT NULL, "postcode" character varying NOT NULL, "community_id" character varying NOT NULL, CONSTRAINT "PK_c19bc9f774c1cf019766a35ca4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "postcode"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "postcode_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_a7a8826654b4427b938b3d52d33" FOREIGN KEY ("postcode_id") REFERENCES "postcode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9cdb25c85a29e34abe49d76c66" ON "postcode" ("postcode") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a7a8826654b4427b938b3d52d33"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "postcode_id"`);
        await queryRunner.query(`DROP TABLE "postcode"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "postcode_id" character varying(20)`);
    }

}
