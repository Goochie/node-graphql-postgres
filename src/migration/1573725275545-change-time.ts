import {MigrationInterface, QueryRunner} from "typeorm";

export class changeTime1573725275545 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" ADD "startTimeI" integer`);
        await queryRunner.query(`ALTER TABLE "event" ADD "endTimeI" integer`);
        try {
          await queryRunner.query(`UPDATE public.event SET
          "startTimeI"=CAST(split_part("startTime", ':', 1) as integer) * 60 + CAST(split_part("startTime", ':', 2) as integer),
          "endTimeI"=CAST(split_part("endTime", ':', 1) as integer) * 60 + CAST(split_part("endTime", ':', 2) as integer);`);
        // tslint:disable-next-line:no-empty
        } catch (e) {}
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "endTimeI"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "startTimeI"`);
    }

}
