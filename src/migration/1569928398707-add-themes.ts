import {MigrationInterface, QueryRunner} from "typeorm";

export class addThemes1569928398707 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.connection.createQueryBuilder(queryRunner)
        .insert()
        .into('theme_images', ['url', 'key'])
        .values([
          {url: 'https://via.placeholder.com/1800/6C9EA4/FFFFFF?text=Theme%203', key: 'Test bucket key'},
          {url: 'https://via.placeholder.com/1800/fb6f6f/FFFFFF?text=Theme%204', key: 'Test bucket key'},
          {url: 'https://via.placeholder.com/1800/fb6f6f/FFFFFF?text=Theme%205', key: 'Test bucket key'},
          {url: 'https://via.placeholder.com/1800/fb6f6f/FFFFFF?text=Theme%206', key: 'Test bucket key'},
          {url: 'https://via.placeholder.com/1800/fb6f6f/FFFFFF?text=Theme%207', key: 'Test bucket key'},
          {url: 'https://via.placeholder.com/1800/fb6f6f/FFFFFF?text=Theme%208', key: 'Test bucket key'},
        ])
        .returning('id')
        .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
