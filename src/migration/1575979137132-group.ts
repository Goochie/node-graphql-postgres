import {MigrationInterface, QueryRunner} from "typeorm";

export class group1575979137132 implements MigrationInterface {
    name = 'group1575979137132'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "event_group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "owner_id" integer NOT NULL, CONSTRAINT "PK_cc0c9c66eb7ef8bb3d8d5164806" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "group_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD CONSTRAINT "FK_5978d1a51eb033a1c357ec09b5c" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_cc0c9c66eb7ef8bb3d8d5164806" FOREIGN KEY ("group_id") REFERENCES "event_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_cc0c9c66eb7ef8bb3d8d5164806"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP CONSTRAINT "FK_5978d1a51eb033a1c357ec09b5c"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "group_id"`, undefined);
        await queryRunner.query(`DROP TABLE "event_group"`, undefined);
    }

}
