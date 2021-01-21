import { Module, HttpModule } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';
import { Review } from './review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostcodeModule } from '../postcode/postcode.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), HttpModule, PostcodeModule, CommonModule, UserModule, NotificationModule],
  providers: [ReviewService, ReviewResolver],
})
export class ReviewModule {}
