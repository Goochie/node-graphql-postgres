import {MigrationInterface, QueryRunner} from "typeorm";

export class notification1571821355057 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "from_id" integer`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_dfe70fb67def14cb4e68935dc79" FOREIGN KEY ("from_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_dfe70fb67def14cb4e68935dc79"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "from_id"`);
    }

}
