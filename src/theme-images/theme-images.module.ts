import { Module } from '@nestjs/common';
import { ThemeImagesService } from './theme-images.service';
import { ThemeImages } from './theme-images.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemeImagesResolver } from './theme-images.resolver';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ThemeImages]), CommonModule, UserModule],
  providers: [ThemeImagesService, ThemeImagesResolver],
  exports: [ThemeImagesService]
})
export class ThemeImagesModule {}
