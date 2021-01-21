import { Module } from '@nestjs/common';
import { EventDocumentService } from './event-document.service';
import { EventDocument } from './event-document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventDocumentResolver } from './event-document.resolver';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([EventDocument]), CommonModule, UserModule],
  providers: [EventDocumentService, EventDocumentResolver],
  exports: [EventDocumentService]
})
export class EventDocumentModule {}
