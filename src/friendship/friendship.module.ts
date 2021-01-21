import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { FriendshipResolver } from './friendship.resolver';
import { FriendshipService } from './friendship.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './friendship.entity';
import { CommonModule } from '../common/common.module';
import { PostcodeModule } from '../postcode/postcode.module';
import { UserModule } from '../user/user.module';
import { MessageModule } from '../message/message.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([Friendship]),
      HttpModule,
      PostcodeModule,
      CommonModule,
      forwardRef(() => MessageModule),
      forwardRef(() => UserModule),
      NotificationModule,
    ],
    providers: [FriendshipResolver, FriendshipService],
    exports: [FriendshipService],
})
export class FriendshipModule {}
