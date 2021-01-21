import {MigrationInterface, QueryRunner} from "typeorm";
import { ThemeImages } from '../theme-images/theme-images.entity';
const baseUrl = 'https://smartlifepath.s3-eu-west-1.amazonaws.com/themes/';
export class themes1579097088515 implements MigrationInterface {
    name = 'themes1579097088515'

    images = [
      'charity',
      'education',
      'entertainment',
      'health',
      'kids-activities',
      'shop',
      'spiritual',
      'sports',
    ];

    public async up(queryRunner: QueryRunner): Promise<any> {
        const themes = await queryRunner.query('SELECT id, url, key FROM "theme_images" WHERE "theme_images"."user_id" IS NULL');

        console.log(themes);
        await queryRunner.query(`ALTER TABLE "theme_images" ADD "isSquare" boolean NOT NULL DEFAULT false`, undefined);

        for (let i = 0; i < themes.length; i++) {
          const t = themes[i];
          t.url =  baseUrl  + this.images[i] + '-theme.png';
          t.key = 'themes/' + this.images[i] + '-theme.png';
          await queryRunner.query(`UPDATE "theme_images" SET "url" = '${t.url}', "key"='${t.key}' WHERE "id" = ${t.id}`);
        }

        for (const t of this.images) {
          await queryRunner.query(`INSERT INTO "theme_images"("key", "url", "isSquare")
            VALUES (\'${'themes/' + t + '-sq.png'}'\, \'${baseUrl  + t + '-sq.png'}\', true )`);
        };
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "theme_images" DROP COLUMN "isSquare"`, undefined);
    }

}
