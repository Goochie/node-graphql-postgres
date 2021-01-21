import { Resolver, Args, Mutation, Context, Query } from '@nestjs/graphql';
import { BuyeraddressService } from './buyeraddress.service';
import { UseGuards, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { BuyerAddressDto } from './dto/buyeraddress.dto';
import { BuyerAddressInputDto } from './dto/buyeraddress-input.dto';
import { FromContextPipe } from '../common/from-context.pipe';
import { User } from '../user/user.entity';
import { OptionalJwtGuard } from '../common/guards/jwt-optyonal.guard';
import { Int } from 'type-graphql';

@Resolver('Buyeraddress')
export class BuyeraddressResolver {
  constructor(private readonly buyerAddressSrv: BuyeraddressService) {
  }
  @Mutation(() => BuyerAddressDto)
  @UseGuards(JwtGuard)
  async createBuyerAddress(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args('input') input: BuyerAddressInputDto,
  ) {
    return this.buyerAddressSrv.create(input);
  }

  @Query(() => [BuyerAddressDto])
  @UseGuards(OptionalJwtGuard)
  async getBuyerAddress(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'addressType'}) addressType: number,
  ) {
    const addresses = (await this.buyerAddressSrv.getAddresses(user, addressType));
    return addresses;
  }
}
