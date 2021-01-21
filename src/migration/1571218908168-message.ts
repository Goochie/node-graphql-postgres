import {MigrationInterface, QueryRunner} from "typeorm";

export class message1571218908168 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL, "text" character varying NOT NULL, "attach_url" character varying, "attach_type" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "is_read" boolean DEFAULT false, "from_id" integer, "to_id" integer, "react_id" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_47f1ad2240dd9ecfbbcf478d77f" FOREIGN KEY ("from_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_9744da731491ef8ca64646a8540" FOREIGN KEY ("to_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_b920c5a6b38bbbfc21f68fa7e88" FOREIGN KEY ("react_id") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_b920c5a6b38bbbfc21f68fa7e88"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_9744da731491ef8ca64646a8540"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_47f1ad2240dd9ecfbbcf478d77f"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
