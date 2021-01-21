import {MigrationInterface, QueryRunner} from 'typeorm';
import { CategoryTypeDto } from '../../categories/dto/category.type.dto';

export class MigrationsHelper {
  static async insertRows(queryRunner: QueryRunner, into: string, type?: string, category = [], parent= 0) {
    for (const cat of category) {
      const fields =  ['name', 'parent'];
      const data: any = {name: cat.name, parent};
      if (type) {
        fields.push('type');
        data.type = type;
      }
      const inBaseCat = await queryRunner.connection.createQueryBuilder(queryRunner)
        .insert()
        .into(into, fields)
        .values([data])
        .returning('id')
        .execute();

      if (cat.children) {
        await MigrationsHelper.insertRows(queryRunner, into, type, cat.children, inBaseCat.raw[0].id );
      }
    }
  }
}
