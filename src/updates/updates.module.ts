import { Module, HttpModule } from '@nestjs/common';
import { UpdateService } from './updates.service';
import { UpdateResolver } from './updates.resolver';
import { Update } from './updates.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostcodeModule } from '../postcode/postcode.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Update]), HttpModule, PostcodeModule, CommonModule, UserModule, NotificationModule],
  providers: [UpdateService, UpdateResolver],
})
export class UpdateModule {}
