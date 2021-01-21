import { Module, HttpModule } from '@nestjs/common';
import { BuyeraddressResolver } from './buyeraddress.resolver';
import { BuyeraddressService } from './buyeraddress.service';
import { BuyerAddress } from './buyaddress.entity';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ TypeOrmModule.forFeature([BuyerAddress]), UserModule],
  providers: [BuyeraddressResolver, BuyeraddressService],
})
export class BuyeraddressModule {}
