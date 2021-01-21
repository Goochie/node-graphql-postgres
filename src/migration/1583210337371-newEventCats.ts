import { MigrationInterface, QueryRunner } from "typeorm";
import { CategoryTypeDto } from '../categories/dto/category.type.dto';
import { MigrationsHelper } from '../common/helpers/MigrationsHelper';

const cats = [
    {name: 'Soft play'},
    {name: 'Arts and crafts'},
    {name: 'Sports', children: [
        {name: 'Swimming'},
        {name: 'Football'},
        {name: 'Rugby'},
        {name: 'Self defence', children: [
            {name: 'MMA'},
            {name: 'Boxing'},
            {name: 'Jujitsu'},
        ]}
    ]},
    {name: 'Community'},
    {name: 'Charity'},
    {name: 'Music'},
    {name: 'Exhibition'},
    {name: 'Arts and theatre'},
    {name: 'Coffee, Tea and Cake'},
    {name: 'Restuarnt / food'},
    {name: 'Health and fitness', children: [
        {name: 'Personal training'},
        {name: 'Pilates'},
        {name: 'Acupuncture'},
        {name: 'Massage'},
        {name: 'Nutritionist'}
    ]},
    {name: 'Beauty and spa\'s', children: [
        {name: 'Hair'},
        {name: 'Nails'},
        {name: 'Tanning'}
    ]},
    {name: 'Movies'}
];

export class newEventCats1583210337371 implements MigrationInterface {
    name = 'newEventCats1583210337371'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DELETE FROM "event_categories" WHERE true`, undefined);
        await queryRunner.query(`DELETE FROM "category" WHERE type = '${CategoryTypeDto.EVENT}'`, undefined);
        await MigrationsHelper.insertRows(queryRunner, 'category', CategoryTypeDto.EVENT, cats);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
