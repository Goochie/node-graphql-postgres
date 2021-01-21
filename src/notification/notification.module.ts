import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { Notification } from './notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostcodeModule } from '../postcode/postcode.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { MessageModule } from '../message/message.module';
import { Organisation } from '../organisation/organisation.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Organisation, User]), HttpModule, PostcodeModule, CommonModule, MessageModule, forwardRef(() => UserModule)],
  providers: [NotificationService, NotificationResolver],
  exports: [NotificationService],
})
export class NotificationModule {}
