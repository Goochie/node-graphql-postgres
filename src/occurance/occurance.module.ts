import { Module, HttpModule } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { Occurance } from './occurance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OccuranceResolver } from './occurance.resolver';
import { OccuranceService } from './occurance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Occurance]),
    HttpModule,
    CommonModule,
  ],
  providers: [OccuranceResolver, OccuranceService],
  exports: [OccuranceService],
})
export class OccuranceModule {}
