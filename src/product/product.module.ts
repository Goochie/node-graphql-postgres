import { Module, HttpModule, Logger } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostcodeModule } from '../postcode/postcode.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';
import { DeliverySettings } from './delivery-setings.entity';
import { Tags } from './tags.entity';
import { Category } from '../categories/category.entity';
import { OrganisationModule } from '../organisation/organisation.module';
import { CategoryService } from '../categories/category.service';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, DeliverySettings, Tags, Category]),
    HttpModule,
    PostcodeModule,
    CommonModule,
    UserModule,
    NotificationModule,
    Logger,
    OrganisationModule,
    CategoriesModule
  ],
  providers: [ProductService, ProductResolver, Logger, OrganisationModule, PostcodeModule, CategoriesModule],
})
export class ProductModule {}
