import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { Message } from './message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostcodeModule } from '../postcode/postcode.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), HttpModule, PostcodeModule, CommonModule, forwardRef(() => UserModule)],
  providers: [MessageService, MessageResolver],
  exports: [MessageService],
})
export class MessageModule {}
