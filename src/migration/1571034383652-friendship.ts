import {MigrationInterface, QueryRunner} from "typeorm";

export class friendship1571034383652 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "friendship_status_enum" AS ENUM('REQUEST', 'APPROVED')`);
        await queryRunner.query(`CREATE TABLE "friendship" ("status" "friendship_status_enum" NOT NULL DEFAULT 'REQUEST', "user_id" integer NOT NULL, "friend_id" integer NOT NULL, CONSTRAINT "PK_8ad5e55bcae38d0bca5cd7d0b38" PRIMARY KEY ("user_id", "friend_id"))`);
        await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_8885973a7c761a7f8fc0fc673f6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_8cadaad5534dd8b4827f05968ef" FOREIGN KEY ("friend_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_8cadaad5534dd8b4827f05968ef"`);
        await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_8885973a7c761a7f8fc0fc673f6"`);
        await queryRunner.query(`DROP TABLE "friendship"`);
        await queryRunner.query(`DROP TYPE "friendship_status_enum"`);
    }

}
