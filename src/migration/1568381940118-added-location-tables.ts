import {MigrationInterface, QueryRunner} from "typeorm";
import * as csv from 'csvtojson';
import * as _ from 'lodash';

const fields = {
  community: ['community_id', 'community', 'county_or_district_id'],
  district: ['district_id', 'district', 'county_id'],
  county: ['county_id', 'county', 'region_id'],
  region: ['region_id', 'region', 'country_id'],
  countries: ['country_id', 'country'],
}

export class AddedLocationTables1568381940118 implements MigrationInterface {
    public async insertData(name, queryRunner: QueryRunner): Promise<any> {
      try {
        let data = await csv().fromFile(`${__dirname}/seed-data/${name}.csv`);
        data = data.map(d => _.pick(d, fields[name]));
        await queryRunner.connection.createQueryBuilder(queryRunner)
              .insert()
              .into(name, fields[name])
              .values(data)
              .execute();
      } catch (e) {
        throw new Error('import data table - ' + name);
      }
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
      const notone = (await Promise.all([
        queryRunner.hasTable('community'),
        queryRunner.hasTable('district'),
        queryRunner.hasTable('county'),
        queryRunner.hasTable('region'),
        queryRunner.hasTable('countries'),
      ])).reduce((a, b) => a && !b, true );

      if (notone) {
        await queryRunner.query(`CREATE TABLE "community" ("community_id" character varying NOT NULL, "community" character varying, "county_or_district_id" character varying, CONSTRAINT "PK_d1d12de5fe7ecd7afb843a923ff" PRIMARY KEY ("community_id"))`);
        await queryRunner.query(`CREATE TABLE "district" ("district_id" character varying NOT NULL, "district" character varying, "county_id" character varying, CONSTRAINT "PK_d13cbacbdeab4c466c8c8dadd5d" PRIMARY KEY ("district_id"))`);
        await queryRunner.query(`CREATE TABLE "county" ("county_id" character varying NOT NULL, "county" character varying, "region_id" character varying, CONSTRAINT "PK_83e316d4070622119dffd4940e6" PRIMARY KEY ("county_id"))`);
        await queryRunner.query(`CREATE TABLE "region" ("region_id" character varying NOT NULL, "region" character varying, "country_id" character varying, CONSTRAINT "PK_54bf2818af7cc627f2f81f091a6" PRIMARY KEY ("region_id"))`);
        await queryRunner.query(`CREATE TABLE "countries" ("country_id" character varying NOT NULL, "country" character varying, CONSTRAINT "PK_9886b09af4b4724d595b2e3923c" PRIMARY KEY ("country_id"))`);

        await this.insertData('community', queryRunner);
        await this.insertData('district', queryRunner);
        await this.insertData('county', queryRunner);
        await this.insertData('region', queryRunner);
        await this.insertData('countries', queryRunner);

        await queryRunner.query(`ALTER TABLE "district" ADD CONSTRAINT "FK_43aa32336d44d8e0cf78379ea32" FOREIGN KEY ("county_id") REFERENCES "county"("county_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "county" ADD CONSTRAINT "FK_5de9b792ac0bbd2fbe1822e2879" FOREIGN KEY ("region_id") REFERENCES "region"("region_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "region" ADD CONSTRAINT "FK_26b43e0b19bc5dc2c480da151b6" FOREIGN KEY ("country_id") REFERENCES "countries"("country_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
      }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "region" DROP CONSTRAINT "FK_26b43e0b19bc5dc2c480da151b6"`);
        await queryRunner.query(`ALTER TABLE "county" DROP CONSTRAINT "FK_5de9b792ac0bbd2fbe1822e2879"`);
        await queryRunner.query(`ALTER TABLE "district" DROP CONSTRAINT "FK_43aa32336d44d8e0cf78379ea32"`);
        await queryRunner.query(`DROP TABLE "countries"`);
        await queryRunner.query(`DROP TABLE "region"`);
        await queryRunner.query(`DROP TABLE "county"`);
        await queryRunner.query(`DROP TABLE "district"`);
        await queryRunner.query(`DROP TABLE "community"`);
    }

}
