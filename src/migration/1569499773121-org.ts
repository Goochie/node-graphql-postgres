import {MigrationInterface, QueryRunner} from "typeorm";

export class org1569499773121 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "theme_images" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "url" character varying NOT NULL, "user_id" integer, CONSTRAINT "PK_6a8502f0b6f39c9d9f0b3ec211e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organisation" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "email" character varying, "website" character varying, "phone" character varying NOT NULL, "photo_url" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, "image_id" integer, "postcode_id" integer, "owner_id" integer, CONSTRAINT "PK_c725ae234ef1b74cce43d2d00c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organisation_categories" ("org_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_f8ab8094835c2b9757bd6a278d9" PRIMARY KEY ("org_id", "category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_76b983ac610f0fafb71c8aa647" ON "organisation_categories" ("org_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e80a80a424ce2a3767352e5f6b" ON "organisation_categories" ("category_id") `);
        await queryRunner.query(`ALTER TABLE "theme_images" ADD CONSTRAINT "FK_12d2974c83d20b75d6d9d434285" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD CONSTRAINT "FK_3d8532fd11f2e2c951d876083d2" FOREIGN KEY ("image_id") REFERENCES "theme_images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD CONSTRAINT "FK_825a292a18223e6881eb5dcd2b4" FOREIGN KEY ("postcode_id") REFERENCES "postcode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD CONSTRAINT "FK_747d212a215337629aa6770ed0c" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_categories" ADD CONSTRAINT "FK_76b983ac610f0fafb71c8aa6477" FOREIGN KEY ("org_id") REFERENCES "organisation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation_categories" ADD CONSTRAINT "FK_e80a80a424ce2a3767352e5f6b3" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

        await queryRunner.connection.createQueryBuilder(queryRunner)
        .insert()
        .into('theme_images', ['url', 'key'])
        .values([
          {url: 'https://via.placeholder.com/1800/6C9EA4/FFFFFF?text=Theme%201', key: 'Test bucket key'},
          {url: 'https://via.placeholder.com/1800/fb6f6f/FFFFFF?text=Theme%202', key: 'Test bucket key 2'}
        ])
        .returning('id')
        .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organisation_categories" DROP CONSTRAINT "FK_e80a80a424ce2a3767352e5f6b3"`);
        await queryRunner.query(`ALTER TABLE "organisation_categories" DROP CONSTRAINT "FK_76b983ac610f0fafb71c8aa6477"`);
        await queryRunner.query(`ALTER TABLE "organisation" DROP CONSTRAINT "FK_747d212a215337629aa6770ed0c"`);
        await queryRunner.query(`ALTER TABLE "organisation" DROP CONSTRAINT "FK_825a292a18223e6881eb5dcd2b4"`);
        await queryRunner.query(`ALTER TABLE "organisation" DROP CONSTRAINT "FK_3d8532fd11f2e2c951d876083d2"`);
        await queryRunner.query(`ALTER TABLE "theme_images" DROP CONSTRAINT "FK_12d2974c83d20b75d6d9d434285"`);
        await queryRunner.query(`DROP INDEX "IDX_e80a80a424ce2a3767352e5f6b"`);
        await queryRunner.query(`DROP INDEX "IDX_76b983ac610f0fafb71c8aa647"`);
        await queryRunner.query(`DROP TABLE "organisation_categories"`);
        await queryRunner.query(`DROP TABLE "organisation"`);
        await queryRunner.query(`DROP TABLE "theme_images"`);
    }

}
