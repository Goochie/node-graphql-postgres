import { MigrationInterface, QueryRunner } from "typeorm";
import { MigrationsHelper } from '../common/helpers/MigrationsHelper';

import { data as countries } from './seed-data/newCountries';
import { data as schoolyear } from './seed-data/schoolYear';

export class schoolYear1586220810371 implements MigrationInterface {
    name = 'schoolYear1586220810371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "school_year" ("id" SERIAL NOT NULL, "country_id" character varying, "school_year" character varying NOT NULL, "age" integer NOT NULL, "stage" character varying NOT NULL, CONSTRAINT "PK_77783460dce6d4d0ded59c4f246" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "isOnline" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD "schoolyear_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "school_year" ADD CONSTRAINT "FK_385faa3b3c32acf523a507f80d0" FOREIGN KEY ("country_id") REFERENCES "countries"("country_id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_fbfb3b02f75f0ffa992f20b7d45" FOREIGN KEY ("schoolyear_id") REFERENCES "school_year"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        
        await queryRunner.connection.createQueryBuilder(queryRunner)
            .insert()
            .into('countries', ['country_id', 'country'])
            .values(countries)
            .execute();
        await queryRunner.connection.createQueryBuilder(queryRunner)
            .insert()
            .into('school_year', ['country_id', 'school_year', 'age', 'stage'])
            .values(schoolyear)
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_fbfb3b02f75f0ffa992f20b7d45"`, undefined);
        await queryRunner.query(`ALTER TABLE "school_year" DROP CONSTRAINT "FK_385faa3b3c32acf523a507f80d0"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "schoolyear_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "isOnline"`, undefined);
        await queryRunner.query(`DROP TABLE "school_year"`, undefined);
    }

}
