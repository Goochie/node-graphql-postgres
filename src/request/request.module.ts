import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './request.entity';
import { RequestGateway } from './request.gateway';
import { RequestResolver } from './request.resolver';
import { RequestService } from './request.service';
import { CommonModule } from '../common/common.module';
import { PostcodeModule } from '../postcode/postcode.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Request]), CommonModule, HttpModule, PostcodeModule, UserModule],
  providers: [RequestGateway, RequestResolver, RequestService],
  exports: [RequestService],
})
export class RequestModule {}
