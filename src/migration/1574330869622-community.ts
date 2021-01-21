import {MigrationInterface, QueryRunner, Like} from "typeorm";
import { Community } from '../common/community/community.entity';
import { District } from '../common/community/district.entity';

import * as csv from 'csvtojson';

export class community1574330869622 implements MigrationInterface {

    public emptyToNull(val) {
      for (const key in val) {
        if(val[key] === '') {
          val[key] = null;
        }
      }
    }

    public async updateData(name, queryRunner: QueryRunner, idName: string): Promise<any> {
      console.log('Start update', name);
      const data = await csv().fromFile(`${__dirname}/seed-data/${name}.csv`);
      for (const val of data) {
        this.emptyToNull(val);
        await queryRunner.connection.createQueryBuilder(queryRunner)
          .update(name)
          .set(val)
          .where({[idName]: val[idName]})
          .execute();
      }
      console.log('Done update', name);
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`CREATE TABLE "local_council" ("id" uuid NOT NULL, "local_council" character varying, "local_council_website" character varying, CONSTRAINT "PK_08d61c0d8d7e4accb303dc73ff1" PRIMARY KEY ("id"))`);
      await queryRunner.query(`ALTER TABLE "community" ADD "local_council_id" uuid`);
      await queryRunner.query(`ALTER TABLE "district" ADD "council_website" character varying`);
      await queryRunner.query(`ALTER TABLE "county" ADD "council_website" character varying`);
      await queryRunner.query(`ALTER TABLE "county" ADD "image" character varying`);
      await queryRunner.query(`ALTER TABLE "county" ADD "other" character varying`);
      await queryRunner.query(`ALTER TABLE "community" ADD CONSTRAINT "FK_d4990980edcc5d4a8e58bc2355f" FOREIGN KEY ("local_council_id") REFERENCES "local_council"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

      await queryRunner.connection.createQueryBuilder(queryRunner)
      .insert()
      .into('local_council', ['id', 'localCouncil', 'localCouncilWebsite'])
      .values([
          {id: '1cf63c16-5744-4ab4-bb2f-f2f092ad18be', localCouncil: 'Bentley Council', localCouncilWebsite: 'http://www.bentleyparishcouncil.co.uk/'},
          {id: '4a342db2-da9a-4b6b-9c37-b8f2e847e20a', localCouncil: 'Buckland Council', localCouncilWebsite: 'https://www.bucklandsurrey.net/parish-council/'},
          {id: '8fa967f8-7687-4d70-b003-afeb77f68c61', localCouncil: 'Claygate Parish Council', localCouncilWebsite: 'http://www.claygateparishcouncil.gov.uk/'},

      ])
      .execute();

      await this.updateData('community', queryRunner, 'community_id');
      await this.updateData('county', queryRunner, 'county_id');
      await this.updateData('district', queryRunner, 'district_id');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "community" DROP CONSTRAINT "FK_d4990980edcc5d4a8e58bc2355f"`);
        await queryRunner.query(`ALTER TABLE "county" DROP COLUMN "other"`);
        await queryRunner.query(`ALTER TABLE "county" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "county" DROP COLUMN "council_website"`);
        await queryRunner.query(`ALTER TABLE "district" DROP COLUMN "council_website"`);
        await queryRunner.query(`ALTER TABLE "community" DROP COLUMN "local_council_id"`);
        await queryRunner.query(`DROP TABLE "local_council"`);
    }

}
