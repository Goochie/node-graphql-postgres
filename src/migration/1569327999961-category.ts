import {MigrationInterface, QueryRunner} from "typeorm";
import { CategoryTypeDto } from '../categories/dto/category.type.dto';

const cats = [
  'Community',
  'Charity',
  'Faith',
  'Food & Drink',
  'Tea, Coffe & Cake',
  'Kids activitys',
]

export class category1569327999961 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "category_type_enum" AS ENUM('ORGANISATION', 'EVENT', 'FUND')`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "parent" integer NOT NULL DEFAULT 0, "name" character varying NOT NULL, "type" "category_type_enum" NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0d53d626cc1e15a4f8d8428612" ON "category" ("parent") `);
        await queryRunner.query(`CREATE INDEX "IDX_63ad76a14a8321d22dc0a5e704" ON "category" ("type") `);
        await queryRunner.connection.createQueryBuilder(queryRunner)
        .insert()
        .into('category', ['name', 'type'])
        .values(cats.map(c => ({name: c, type: CategoryTypeDto.ORGANISATION})))
        .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_63ad76a14a8321d22dc0a5e704"`);
        await queryRunner.query(`DROP INDEX "IDX_0d53d626cc1e15a4f8d8428612"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TYPE "category_type_enum"`);
    }

}
