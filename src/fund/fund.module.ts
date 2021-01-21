import { Module, HttpModule } from '@nestjs/common';
import { FundService } from './fund.service';
import { FundResolver } from './fund.resolver';
import { Fund } from './fund.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostcodeModule } from '../postcode/postcode.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Fund]), HttpModule, PostcodeModule, CommonModule, UserModule, NotificationModule],
  providers: [FundService, FundResolver],
  exports: [FundService],
})
export class FundModule {}
