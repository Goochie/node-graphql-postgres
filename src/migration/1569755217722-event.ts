import {MigrationInterface, QueryRunner} from 'typeorm';
import { MigrationsHelper } from '../common/helpers/MigrationsHelper';
import { CategoryTypeDto } from '../categories/dto/category.type.dto';
const cats = [
  {name: 'Kids activities',
   children: [
    {name: 'Soft play'},
    {name: 'Arts and crafts'},
    {name: 'Sports',
    children: [
      {name: 'Swimming'},
      {name: 'Football'},
      {name: 'Rugby'},
      {name: 'Combat'},
    ]},
  ]},
  {name: 'Community'},
  {name: 'Charity'},
  {name: 'Music'},
  {name: 'Exhbition'},
  {name: 'Arts and theatre'},
  {name: 'Coffee, Tea and Cake'},
  {name: 'Restuarnt / food'},
  {name: 'Health and fitness',
  children: [
    {name: 'Personal training'},
    {name: 'Group class\'s',
    children: [
      {name: 'Pilates'},
      {name: 'Martial arts'},
      {name: 'Boxing / Kick boxing'},
    ]},
    {name: 'Acupunture'},
    {name: 'Massage'},
    {name: 'Nutrisionist'},
  ]},
  {name: 'Beauty and spa\'s',
  children: [
    {name: 'Hair'},
    {name: 'Nails'},
    {name: 'Tanning'},
  ]},
  {name: 'Movies',
  children: [
    {name: 'Sports',
    children: [
      {name: 'Swimming'},
      {name: 'Football'},
      {name: 'Rugby'},
      {name: 'Combat'},
    ]},
  ]},
];

const freq = [
  {name: 'Occurs Once'},
  {name: 'Week days',
   children: [
    {name: 'Mondey'},
    {name: 'Tuesday'},
    {name: 'Wed'},
    {name: 'Thur'},
    {name: 'Fri'},
    {name: 'Sat'},
    {name: 'San'},
  ]},
  {name: 'Repeat of number of week'},
];

export class event1569755217722 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "occurance" ("id" SERIAL NOT NULL, "parent" integer NOT NULL DEFAULT 0, "name" character varying NOT NULL, CONSTRAINT "PK_a52abe0a1d7c48404c45b602a16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_01337716be10c9d83b6c96c81d" ON "occurance" ("parent") `);
        await queryRunner.query(`CREATE TABLE "event" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "location" character varying, "startDate" TIMESTAMP NOT NULL, "startTime" character varying, "endDate" TIMESTAMP, "endTime" character varying, "repeat" integer, "photo_url" character varying, "created_date" TIMESTAMP NOT NULL DEFAULT now(), "updated_date" TIMESTAMP NOT NULL DEFAULT now(), "deleted_date" TIMESTAMP, "image_id" integer, "postcode_id" integer, "owner_id" integer, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_categories" ("event_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_612fc92db0790503827c0b82af9" PRIMARY KEY ("event_id", "category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c78c7b670b392b79ee76f01b67" ON "event_categories" ("event_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_372a350b878524310e04d0ddec" ON "event_categories" ("category_id") `);
        await queryRunner.query(`CREATE TABLE "event_occurance" ("event_id" integer NOT NULL, "occurance_id" integer NOT NULL, CONSTRAINT "PK_9aaa663a8ac8dfb3ca667ba5b82" PRIMARY KEY ("event_id", "occurance_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_38b1a8ec010bd765f595ec6ace" ON "event_occurance" ("event_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_acf5f5850b205b122337610db5" ON "event_occurance" ("occurance_id") `);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_4b28dce817e9888b5a9c8f301d2" FOREIGN KEY ("image_id") REFERENCES "theme_images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_f9db964df765c44a650450577f0" FOREIGN KEY ("postcode_id") REFERENCES "postcode"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_36367b592f4185fd34f9a444075" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_categories" ADD CONSTRAINT "FK_c78c7b670b392b79ee76f01b675" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_categories" ADD CONSTRAINT "FK_372a350b878524310e04d0ddec2" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_occurance" ADD CONSTRAINT "FK_38b1a8ec010bd765f595ec6aced" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_occurance" ADD CONSTRAINT "FK_acf5f5850b205b122337610db58" FOREIGN KEY ("occurance_id") REFERENCES "occurance"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await MigrationsHelper.insertRows(queryRunner, 'category', CategoryTypeDto.EVENT, cats);
        await MigrationsHelper.insertRows(queryRunner, 'occurance', undefined, freq);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_occurance" DROP CONSTRAINT "FK_acf5f5850b205b122337610db58"`);
        await queryRunner.query(`ALTER TABLE "event_occurance" DROP CONSTRAINT "FK_38b1a8ec010bd765f595ec6aced"`);
        await queryRunner.query(`ALTER TABLE "event_categories" DROP CONSTRAINT "FK_372a350b878524310e04d0ddec2"`);
        await queryRunner.query(`ALTER TABLE "event_categories" DROP CONSTRAINT "FK_c78c7b670b392b79ee76f01b675"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_36367b592f4185fd34f9a444075"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_f9db964df765c44a650450577f0"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_4b28dce817e9888b5a9c8f301d2"`);
        await queryRunner.query(`DROP INDEX "IDX_acf5f5850b205b122337610db5"`);
        await queryRunner.query(`DROP INDEX "IDX_38b1a8ec010bd765f595ec6ace"`);
        await queryRunner.query(`DROP TABLE "event_occurance"`);
        await queryRunner.query(`DROP INDEX "IDX_372a350b878524310e04d0ddec"`);
        await queryRunner.query(`DROP INDEX "IDX_c78c7b670b392b79ee76f01b67"`);
        await queryRunner.query(`DROP TABLE "event_categories"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP INDEX "IDX_01337716be10c9d83b6c96c81d"`);
        await queryRunner.query(`DROP TABLE "occurance"`);
    }

}
