import {MigrationInterface, QueryRunner} from "typeorm";

export class remove1570104891818 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.connection.createQueryBuilder(queryRunner)
        .delete()
        .from('occurance')
        .where({name: 'Repeat of number of week'})
        .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.connection.createQueryBuilder(queryRunner)
        .insert()
        .into('occurance')
        .values([{name: 'Repeat of number of week'}])
        .execute();
    }

}
