import {MigrationInterface, QueryRunner} from "typeorm";

export class test1573648765397 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`ALTER TABLE "theme_images" DROP CONSTRAINT "FK_12d2974c83d20b75d6d9d434285"`);
      await queryRunner.query(`ALTER TABLE "theme_images" ADD CONSTRAINT "FK_12d2974c83d20b75d6d9d434285" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
      await queryRunner.connection.createQueryBuilder(queryRunner)
        .insert()
        .into('theme_images', ['url', 'key'])
        .values([
          {url: 'https://via.placeholder.com/1800/6C9EA4/FFFFFF?text=Theme%201', key: 'Test bucket key'},
          {url: 'https://via.placeholder.com/1800/fb6f6f/FFFFFF?text=Theme%202', key: 'Test bucket key 2'},
          {url: 'https://via.placeholder.com/1800/fb6f6f/FFFFFF?text=Theme%203', key: 'Test bucket key 3'},
          {url: 'https://via.placeholder.com/1800/fb6f6f/FFFFFF?text=Theme%204', key: 'Test bucket key 4'},
          {url: 'https://via.placeholder.com/1800/fb6f6f/FFFFFF?text=Theme%205', key: 'Test bucket key 5'},
          {url: 'https://via.placeholder.com/1800/fb6f6f/FFFFFF?text=Theme%206', key: 'Test bucket key 6'},
          {url: 'https://via.placeholder.com/1800/fb6f6f/FFFFFF?text=Theme%207', key: 'Test bucket key 7'},
          {url: 'https://via.placeholder.com/1800/fb6f6f/FFFFFF?text=Theme%208', key: 'Test bucket key 8'},
        ])
        .returning('id')
        .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`ALTER TABLE "theme_images" DROP CONSTRAINT "FK_12d2974c83d20b75d6d9d434285"`);
      await queryRunner.query(`ALTER TABLE "theme_images" ADD CONSTRAINT "FK_12d2974c83d20b75d6d9d434285" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
