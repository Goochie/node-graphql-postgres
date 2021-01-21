import { MigrationInterface, QueryRunner } from 'typeorm';
import { MigrationsHelper } from '../common/helpers/MigrationsHelper';
import { CategoryTypeDto } from '../categories/dto/category.type.dto';

const cats = [
  {name: 'Craft Supplies',
   children: [
    {name: 'Wood Crafts',
     children: [
        {name: 'Wooden Buttons'},
        {name: 'Wooden Cubes'},
        {name: 'Wooden Eggs and Fruit'},
      ]
    },
    {name: 'Hobby',
    children: [
      {name: 'Clay and Modeling'},
      {name: 'Candle Making Supplies'},
      {name: 'Lamp Making'},
    ]},
  ]},
  {name: 'Health',
  children: [
    {
      name: 'Diagnostics',
      children: [
        {name: 'Blood Glucose Monitors'},
        {name: 'Digital Thermometers'},
        {name: 'Cholesterol Testing'},
      ]
    },
    {
      name: 'Pediatrics',
      children: [
        {name: 'Children\'s Allergy Medicine'},
        {name: 'Children\'s Multivitamins'},
        {name: 'Diaper Rash Products'},
        {name: 'Children\'s Pain Relief'},
      ]
    },
  ]},
];

export class storeCats1574943562541 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TYPE "public"."category_type_enum" RENAME TO "category_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "category_type_enum" AS ENUM('ORGANISATION', 'EVENT', 'FUND', 'STORE_PRODUCT')`);
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "type" TYPE "category_type_enum" USING "type"::"text"::"category_type_enum"`);
        await queryRunner.query(`DROP TYPE "category_type_enum_old"`);

        await MigrationsHelper.insertRows(queryRunner, 'category', CategoryTypeDto.STORE_PRODUCT, cats);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "category_type_enum_old" AS ENUM('ORGANISATION', 'EVENT', 'FUND')`);
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "type" TYPE "category_type_enum_old" USING "type"::"text"::"category_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "category_type_enum"`);
        await queryRunner.query(`ALTER TYPE "category_type_enum_old" RENAME TO  "category_type_enum"`);
    }

}
