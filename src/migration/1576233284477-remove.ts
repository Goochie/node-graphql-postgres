import {MigrationInterface, QueryRunner} from "typeorm";

export class remove1576233284477 implements MigrationInterface {
    name = 'remove1576233284477'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DELETE FROM "tbl_todo_tasks" WHERE id = 'JOIN-COMMUNITY'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {

    }

}
