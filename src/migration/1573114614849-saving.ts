import {MigrationInterface, QueryRunner} from "typeorm";

export class saving1573114614849 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user_saving" ("id" SERIAL NOT NULL, "rooms" integer NOT NULL, "type" character varying NOT NULL, "user_id" integer, CONSTRAINT "PK_af9c268177e8fb1620fb1bbbd3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_saving" ADD CONSTRAINT "FK_624ca4a9768dc5a53896f343746" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_saving" DROP CONSTRAINT "FK_624ca4a9768dc5a53896f343746"`);
        await queryRunner.query(`DROP TABLE "user_saving"`);
    }

}
