import {MigrationInterface, QueryRunner} from "typeorm";

export class product1575570328274 implements MigrationInterface {
    name = 'product1575570328274'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE organisation_product RENAME TO product;`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`ALTER TABLE product RENAME TO organisation_product;`, undefined);
    }

}
