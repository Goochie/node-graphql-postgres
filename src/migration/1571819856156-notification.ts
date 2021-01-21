import {MigrationInterface, QueryRunner} from "typeorm";

export class notification1571819856156 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL, "text" character varying NOT NULL, "entity_id" character varying, "entity" character varying, "isRead" boolean DEFAULT false, "icon" character varying, "type" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_928b7aa1754e08e1ed7052cb9d8" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_928b7aa1754e08e1ed7052cb9d8"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
