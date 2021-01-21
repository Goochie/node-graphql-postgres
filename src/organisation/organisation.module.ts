import { Module, HttpModule, Logger } from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { OrganisationResolver } from './organisation.resolver';
import { Organisation } from './organisation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostcodeModule } from '../postcode/postcode.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';
import { PurchaseProduct } from '../common/product/purchase-product.entity';
import { FundModule } from '../fund/fund.module';
import { Product } from '../product/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organisation, Product, PurchaseProduct]),
    HttpModule,
    PostcodeModule,
    CommonModule,
    NotificationModule,
    FundModule,
    UserModule,
    Logger,
  ],
  providers: [OrganisationService, OrganisationResolver, Logger],
  exports: [OrganisationService],
})
export class OrganisationModule {}
