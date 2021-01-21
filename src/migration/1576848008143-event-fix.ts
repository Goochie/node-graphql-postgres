import {MigrationInterface, QueryRunner} from "typeorm";
import { Event } from '../event/event.entity';
import { strTimeToNumber } from '../event/event.service';

export class eventFix1576848008143 implements MigrationInterface {
    name = 'eventFix1576848008143'

    public async up(queryRunner: QueryRunner): Promise<any> {
      const events = await queryRunner.connection.createQueryBuilder(queryRunner)
      .select('*')
      .from('event', 'event')
      .execute();

      for (const e of events) {
        if (e.startTime) {
          e.startTimeI = strTimeToNumber(e.startTime);
        }
        if (e.endTime) {
          e.endTimeI = strTimeToNumber(e.endTime);
        }
        await queryRunner.connection.createQueryBuilder(queryRunner)
        .update('event')
        .set({
          startTimeI: e.startTimeI,
          endTimeI: e.endTimeI,
        })
        .where({id: e.id})
        .execute();
      }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
