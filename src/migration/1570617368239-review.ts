import {MigrationInterface, QueryRunner} from "typeorm";

export class review1570617368239 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "review" ("id" uuid NOT NULL, "text" character varying NOT NULL, "organisation_id" integer, "community_id" character varying, "rating" integer, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, "parent_id" uuid, "owner_id" integer, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_8de4f808f4eacb91ea24c56e695" FOREIGN KEY ("organisation_id") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_0ee881ecb1e1ea0254e0ac7854a" FOREIGN KEY ("community_id") REFERENCES "community"("community_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_2179b2c9e64055e2077a2b6e6c8" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_138911d00384e532c0677c9421e" FOREIGN KEY ("parent_id") REFERENCES "review"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_138911d00384e532c0677c9421e"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_2179b2c9e64055e2077a2b6e6c8"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_0ee881ecb1e1ea0254e0ac7854a"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_8de4f808f4eacb91ea24c56e695"`);
        await queryRunner.query(`DROP TABLE "review"`);
    }

}
