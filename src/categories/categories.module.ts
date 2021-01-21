import { Module, HttpModule, Logger } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { Category } from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    HttpModule,
    CommonModule,
    Logger
  ],
  providers: [CategoryResolver, CategoryService, Logger],
  exports: [CategoryService],
})
export class CategoriesModule {}
