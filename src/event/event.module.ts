import { Module, HttpModule, Logger } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { Event } from './event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostcodeModule } from '../postcode/postcode.module';
import { RecurringModule } from '../recurring/recurring.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';
import { EventGroup } from './event-group.entity';
import { SchoolYear } from '../common/school-year/school-year.entity';
import { EventDocumentModule } from '../event-document/event-document.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventGroup, SchoolYear]), HttpModule, PostcodeModule, EventDocumentModule, RecurringModule, CommonModule, UserModule, NotificationModule, Logger],
  providers: [EventService, EventResolver, Logger],
})
export class EventModule {}
