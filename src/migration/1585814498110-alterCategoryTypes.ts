import {MigrationInterface, QueryRunner} from "typeorm";

export class alterCategoryTypes1585814498110 implements MigrationInterface {
    name = 'alterCategoryTypes1585814498110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."category_type_enum" RENAME TO "category_type_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "category_type_enum" AS ENUM('ORGANISATION', 'EVENT', 'FUND', 'STORE_PRODUCT', 'SERVICE')`, undefined);
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "type" TYPE "category_type_enum" USING "type"::"text"::"category_type_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "category_type_enum_old"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "category_type_enum_old" AS ENUM('ORGANISATION', 'EVENT', 'FUND', 'STORE_PRODUCT')`, undefined);
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "type" TYPE "category_type_enum_old" USING "type"::"text"::"category_type_enum_old"`, undefined);
        await queryRunner.query(`DROP TYPE "category_type_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "category_type_enum_old" RENAME TO  "category_type_enum"`, undefined);
    }

}
