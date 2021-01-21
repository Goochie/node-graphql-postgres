import { Module } from '@nestjs/common';
import { PostcodeService } from './postcode.service';
import { PostCode } from './post-code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostCode]), CommonModule],
  providers: [PostcodeService],
  exports: [PostcodeService],
})
export class PostcodeModule {}
