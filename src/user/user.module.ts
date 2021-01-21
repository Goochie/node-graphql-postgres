import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CommonModule } from '../common/common.module';
import { PostcodeModule } from '../postcode/postcode.module';
import { FriendshipModule } from '../friendship/friendship.module';
import { UserSaving } from './user-saving.entity';
import { ScheduleModule } from 'nest-schedule';
import { Event } from '../event/event.entity';
import { Fund } from '../fund/fund.entity';
import { Notification } from '../notification/notification.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([
        User,
        UserSaving,
        Event,
        Fund,
        Notification,
      ]),
      HttpModule,
      PostcodeModule,
      CommonModule,
      forwardRef(() => FriendshipModule),
      ScheduleModule.register(),
    ],
    providers: [UserResolver, UserService],
    exports: [UserService],
})
export class UserModule {}
