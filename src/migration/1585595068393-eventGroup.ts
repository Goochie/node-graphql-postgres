import {MigrationInterface, QueryRunner} from "typeorm";

export class eventGroup1585595068393 implements MigrationInterface {
    name = 'eventGroup1585595068393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event_group_categories" ("event_group_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_8a4f7748c51f8d750578dbe498f" PRIMARY KEY ("event_group_id", "category_id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_25cf605f00be9dd2478f713f55" ON "event_group_categories" ("event_group_id") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_49bb64a5587c4c6e482f530927" ON "event_group_categories" ("category_id") `, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP COLUMN "name"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD "title" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD "description" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD "cost" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD "seats" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD "created_date" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD "updated_date" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD "deleted_date" TIMESTAMP`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD "image_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD "organisation_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD "postcode_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD "assign_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP CONSTRAINT "FK_5978d1a51eb033a1c357ec09b5c"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ALTER COLUMN "owner_id" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD CONSTRAINT "FK_adef8bc9d7a146a58ff5ebaeed9" FOREIGN KEY ("image_id") REFERENCES "theme_images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD CONSTRAINT "FK_5978d1a51eb033a1c357ec09b5c" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD CONSTRAINT "FK_34251fd1414bdfdad867d270090" FOREIGN KEY ("organisation_id") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD CONSTRAINT "FK_72a0ec26567b6baff930d504128" FOREIGN KEY ("postcode_id") REFERENCES "postcode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD CONSTRAINT "FK_776a6b3863993280cdd501210ae" FOREIGN KEY ("assign_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group_categories" ADD CONSTRAINT "FK_25cf605f00be9dd2478f713f550" FOREIGN KEY ("event_group_id") REFERENCES "event_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group_categories" ADD CONSTRAINT "FK_49bb64a5587c4c6e482f530927d" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_group_categories" DROP CONSTRAINT "FK_49bb64a5587c4c6e482f530927d"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group_categories" DROP CONSTRAINT "FK_25cf605f00be9dd2478f713f550"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP CONSTRAINT "FK_776a6b3863993280cdd501210ae"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP CONSTRAINT "FK_72a0ec26567b6baff930d504128"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP CONSTRAINT "FK_34251fd1414bdfdad867d270090"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP CONSTRAINT "FK_5978d1a51eb033a1c357ec09b5c"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP CONSTRAINT "FK_adef8bc9d7a146a58ff5ebaeed9"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ALTER COLUMN "owner_id" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD CONSTRAINT "FK_5978d1a51eb033a1c357ec09b5c" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP COLUMN "assign_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP COLUMN "postcode_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP COLUMN "organisation_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP COLUMN "image_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP COLUMN "deleted_date"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP COLUMN "updated_date"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP COLUMN "created_date"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP COLUMN "seats"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP COLUMN "cost"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP COLUMN "description"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" DROP COLUMN "title"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_group" ADD "name" character varying NOT NULL`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_49bb64a5587c4c6e482f530927"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_25cf605f00be9dd2478f713f55"`, undefined);
        await queryRunner.query(`DROP TABLE "event_group_categories"`, undefined);
    }

}
