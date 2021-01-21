import {MigrationInterface, QueryRunner} from "typeorm";
const user = [
  {
    text: 'Join Community',
    id: 'JOIN-COMMUNITY',
    type: 'user',
  },
  {
    text: 'Select a fund to sponsor',
    id: 'SELECT-FUND',
    type: 'user',
  },
  {
    text: 'Find local organisations',
    id: 'FIND-ORGANISATIONS',
    type: 'user',
  },
  {
    text: 'Find local events',
    id: 'FIND-EVENTS',
    type: 'user',
  },
  {
    text: 'Connect with other communities',
    id: 'CONNECT-WITH-COMMUNITIES',
    type: 'user',
  },
  {
    text: 'Invite friends',
    id: 'INVITE-FRIENDS',
    type: 'user',
  },
];

const org = [
  {
    text: 'Create an Organisation',
    id: 'CREATE-ORG',
    type: 'org',
  },
  {
    text: 'Create an event for your organisation',
    id: 'CREATE-EVENT',
    type: 'org',
  },
  {
    text: 'Create an fund for your organisation',
    id: 'CREATE-FUND',
    type: 'org',
  },
  {
    text: 'Add an update',
    id: 'UPDATE',
    type: 'org',
  },
  {
    text: 'Invite people',
    id: 'INVITE-PEOPLE',
    type: 'org',
  },
];

export class todo1571907051159 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "tbl_todo_tasks" ("id" character varying NOT NULL, "type" character varying NOT NULL, "text" character varying NOT NULL, CONSTRAINT "PK_3976fa53379627bde2a463e5c4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "compliteTodo" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD "orgTodo" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "todo" boolean NOT NULL DEFAULT false`);

        await queryRunner.connection.createQueryBuilder(queryRunner)
        .insert()
        .into('tbl_todo_tasks', ['text', 'id', 'type'])
        .values([
          ...org,
          ...user,
        ])
        .returning('id')
        .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "todo"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "orgTodo"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "compliteTodo"`);
        await queryRunner.query(`DROP TABLE "tbl_todo_tasks"`);
    }

}
