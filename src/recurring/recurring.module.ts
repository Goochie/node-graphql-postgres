import { Module } from '@nestjs/common';
import { RecurringService } from './recurring.service';
import { Recurring } from './recurring.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recurring]), CommonModule],
  providers: [RecurringService],
  exports: [RecurringService],
})
export class RecurringModule {}