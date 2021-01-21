import {MigrationInterface, QueryRunner} from "typeorm";
import { CategoryTypeDto } from '../categories/dto/category.type.dto';
const cats = [
  'Medical',
  'Personal Emergancy',
  'Family, Pets',
  'Animals',
  'Faith',
  'Education',
  'Other',
]
export class fund1569937106508 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "fund" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "isPublic" boolean NOT NULL, "isPublished" boolean NOT NULL DEFAULT false, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE, "amount" integer NOT NULL, "photo_url" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, "image_id" integer, "owner_id" integer, CONSTRAINT "PK_b3ac6e413e6e449bb499db1ccbc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fund_categories" ("fund_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_ed9d95480a799e173ff93377bcf" PRIMARY KEY ("fund_id", "category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c3e0fb1bb53c9440bd9ca4a7d8" ON "fund_categories" ("fund_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_87ffa5271b3d2321e1abda26cb" ON "fund_categories" ("category_id") `);
        await queryRunner.query(`CREATE TABLE "fund_followers" ("fund_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_0c2fbcda880ccc49ccd81398308" PRIMARY KEY ("fund_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a48a32413109d24d13e14e965e" ON "fund_followers" ("fund_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a094a20f03f116f7bd1e86c65e" ON "fund_followers" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "fund" ADD CONSTRAINT "FK_71bfac23650a79fb8188b339c7e" FOREIGN KEY ("image_id") REFERENCES "theme_images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fund" ADD CONSTRAINT "FK_18162239c9b7e736dcbc91f1d1a" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fund_categories" ADD CONSTRAINT "FK_c3e0fb1bb53c9440bd9ca4a7d8b" FOREIGN KEY ("fund_id") REFERENCES "fund"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fund_categories" ADD CONSTRAINT "FK_87ffa5271b3d2321e1abda26cb0" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fund_followers" ADD CONSTRAINT "FK_a48a32413109d24d13e14e965e8" FOREIGN KEY ("fund_id") REFERENCES "fund"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fund_followers" ADD CONSTRAINT "FK_a094a20f03f116f7bd1e86c65ef" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.connection.createQueryBuilder(queryRunner)
          .insert()
          .into('category', ['name', 'type'])
          .values(cats.map(c => ({name: c, type: CategoryTypeDto.FUND})))
          .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "fund_followers" DROP CONSTRAINT "FK_a094a20f03f116f7bd1e86c65ef"`);
        await queryRunner.query(`ALTER TABLE "fund_followers" DROP CONSTRAINT "FK_a48a32413109d24d13e14e965e8"`);
        await queryRunner.query(`ALTER TABLE "fund_categories" DROP CONSTRAINT "FK_87ffa5271b3d2321e1abda26cb0"`);
        await queryRunner.query(`ALTER TABLE "fund_categories" DROP CONSTRAINT "FK_c3e0fb1bb53c9440bd9ca4a7d8b"`);
        await queryRunner.query(`ALTER TABLE "fund" DROP CONSTRAINT "FK_18162239c9b7e736dcbc91f1d1a"`);
        await queryRunner.query(`ALTER TABLE "fund" DROP CONSTRAINT "FK_71bfac23650a79fb8188b339c7e"`);
        await queryRunner.query(`DROP INDEX "IDX_a094a20f03f116f7bd1e86c65e"`);
        await queryRunner.query(`DROP INDEX "IDX_a48a32413109d24d13e14e965e"`);
        await queryRunner.query(`DROP TABLE "fund_followers"`);
        await queryRunner.query(`DROP INDEX "IDX_87ffa5271b3d2321e1abda26cb"`);
        await queryRunner.query(`DROP INDEX "IDX_c3e0fb1bb53c9440bd9ca4a7d8"`);
        await queryRunner.query(`DROP TABLE "fund_categories"`);
        await queryRunner.query(`DROP TABLE "fund"`);
    }

}
