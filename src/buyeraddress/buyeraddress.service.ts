import { Injectable } from '@nestjs/common';
import { Repository, getManager, Brackets } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerAddress } from './buyaddress.entity';
import { User } from '../user/user.entity';
import { BuyerAddressInputDto } from './dto/buyeraddress-input.dto';
import { HttpErrorHelper } from '../common/helpers/http-error-helper';

@Injectable()
export class BuyeraddressService {
  constructor(
    @InjectRepository(BuyerAddress)
    private readonly buyerAddressRepository: Repository<BuyerAddress>,
  ) {}
  async create(buyerAddress: BuyerAddressInputDto): Promise<BuyerAddress> {
    return await getManager().transaction(async tractionalBuyerAddressManager => {
      try {
        const newaddr = new BuyerAddress({
            ...buyerAddress,
        });
        let savedBuyerAddress = await tractionalBuyerAddressManager.save(BuyerAddress, newaddr);
        savedBuyerAddress  = await tractionalBuyerAddressManager.findOne(BuyerAddress, savedBuyerAddress.id, {relations: ['buyer']});
        return savedBuyerAddress;
      } catch (err) {
        HttpErrorHelper.checkDataBaseError(err);
        throw err;
      }
    });
  }
  async getAddresses(user: User, addressType: number) {
    const userId = user.id;
    const query = this.buyerAddressRepository.createQueryBuilder('buyer_address').select();
    query.leftJoinAndSelect('buyer_address.buyer', 'buyer');
    query.where('buyer.id = (:userId)', {userId});
    query.andWhere(new Brackets(qb => {
      qb.where('buyer_address.address_type = (:addressType)', {addressType})
        .orWhere('buyer_address.address_type = 3');
    }));
    const addresses = await query.getMany();
    return addresses;
  }
}
