import { Resolver, Args, Mutation, Context, Query } from '@nestjs/graphql';
import { FundService } from './fund.service';
import { Arg, Int, Float } from 'type-graphql';
import { UseGuards, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { FundDto } from './dto/fund.dto';
import { FundInputDto } from './dto/fund-input.dto';
import { FromContextPipe } from '../common/from-context.pipe';
import { User } from '../user/user.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FileService } from '../common/services/file/file.service';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { OptionalJwtGuard } from '../common/guards/jwt-optyonal.guard';
import { HTTP_ERROR_YOU_OWNER_FUND } from '../common/helpers/http-error-helper';
import { HTTP_ERROR_FUND_NOT_FOUND } from '../common/helpers/http-error-helper';
import { UserOut } from '../user/dto/user.out';
import { StripeService } from '../common/services/stripe/stripe.service';
import { PaymentData } from './dto/payment-data-input.dto';
import { FundStat } from './dto/user-stat';
import { In, Raw, LessThan } from 'typeorm';
import { Fund } from './fund.entity';
import { FundUpdateDto } from './dto/fund-output.dto';
import { TopFund } from './dto/top-fund';

@Resolver('Fund')
export class FundResolver {

  constructor(
    private readonly fundSrv: FundService,
    private readonly fileSrv: FileService,
    private readonly stripeSrv: StripeService,
  ) {

  }

  @Query(() => FundDto)
  @UseGuards(OptionalJwtGuard)
  async getFund(@Context(new FromContextPipe('req.user')) user: User, @Args({type: () => Int, name: 'id'}) id: number) {
    const fund = (await this.fundSrv.find({id}, {isIFollow: (user) ? user.id : null}))[0];
    if (!fund) {
      throw new NotFoundException(HTTP_ERROR_FUND_NOT_FOUND);
    }
    return fund;
  }

  @Query(() => [FundDto])
  @UseGuards(JwtGuard)
  async getMyFund(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => String, name: 'status', nullable: true}) status: 'Open'|'Draft'|'Close',
    @Args({type: () => Boolean, name: 'iOwner', nullable: true}) iOwner: boolean,
  ) {
    let where: any[] = [{owner: {id: user.id}}, {fund_followers: user.id}];
    if (iOwner) {
      where = [{owner: {id: user.id}}];
    } else if (iOwner === false ) {
      where = [{fund_followers: user.id}];
    }
    if (status) {
      if (status === 'Draft') {
        where.forEach(w => {
          w.isPublished = false;
          w.endDate = Raw(alias => `(${alias} > NOW() OR ${alias} IS NULL)`);
        });
      } else if (status === 'Open') {
        where.forEach(w => {
          w.isPublished = true;
          w.endDate = Raw(alias => `(${alias} > NOW() OR ${alias} IS NULL)`);
        });
      } else {
        where.forEach(w => {
          w.endDate = LessThan(new Date());
        });
      }
    }

    const funds = (await this.fundSrv.find(where, {isIFollow: user.id}));

    return funds;
  }

  @Query(() => Float)
  @UseGuards(JwtGuard)
  async fundCanPayout(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id', nullable: true}) id: number,
  ) {
    const canPay = await this.fundSrv.canPayout(id);

    return canPay / 100;
  }

  @Query(() => [FundDto])
  @UseGuards(OptionalJwtGuard)
  async searchFund(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => [Float, Float], name: 'coordinates', nullable: true}) coordinates: [number, number],
    @Args({type: () => Float, name: 'radius', nullable: true}) radius: number,
    @Args({type: () => [Int], name: 'categories', nullable: true}) categories: number[],
  ) {
    return this.fundSrv.search(coordinates, radius, categories, {isIFollow: (user) ? user.id : null});
  }

  @Query(() => [FundDto])
  @UseGuards(OptionalJwtGuard)
  async getFundForOrg(@Context(new FromContextPipe('req.user')) user: User, @Args({type: () => Int, name: 'id'}) id: number) {
    const fund = (await this.fundSrv.find({organisation_id: id, isPublished: true}, {isIFollow: (user) ? user.id : null}));
    return fund;
  }

  @Query(() => [FundDto])
  @UseGuards(OptionalJwtGuard)
  async getFundForCommunity(@Context(new FromContextPipe('req.user')) user: User, @Args({type: () => String, name: 'id'}) id: string) {
    const fund = (await this.fundSrv.getFundForCommunity(id, {isIFollow: (user) ? user.id : null}));
    return fund;
  }

  @Query(() => [FundDto])
  @UseGuards(OptionalJwtGuard)
  async getTopFundForCommunity(@Context(new FromContextPipe('req.user')) user: User, @Args({type: () => String, name: 'postcode'}) postcode: string) {
    const fund = (await this.fundSrv.getTopFundForCommunity(postcode, {isIFollow: (user) ? user.id : null}));
    return fund;
  }

  @Query(() => [FundDto])
  @UseGuards(OptionalJwtGuard)
  async getFundForCommunityWithCategory(
    @Context(new FromContextPipe('req.user')) user: User, 
    @Args({type: () => String, name: 'postcode'}) postcode: string,
    @Args({type: () => [Int], name: 'category_ids'}) category_ids: [number]
  ) {
    const fund = (await this.fundSrv.getFundForCommunityWithCategory(postcode, category_ids, {isIFollow: (user) ? user.id : null}));
    return fund;
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async contrbution(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'fundId'}) id: number,
    @Args({type: () => PaymentData, name: 'paymentData'}) paymentData: PaymentData,
   ) {
    const fund = (await this.fundSrv.find({id}, {isIFollow: (user) ? user.id : null}))[0];
    if (!user.stripeId) {
      await this.stripeSrv.createUser(user);
    }
    await this.stripeSrv.charge(paymentData, fund, user);
    fund.raisedData = new Date(Date.now() - 1000 * 60 * 60 * 3);
    await this.fundSrv.cash.clear('USER_CONTRIBUTE_' + user.id);
    await this.fundSrv.save(fund);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async payout(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'fundId'}) id: number,
    @Args({type: () => PaymentData, name: 'paymentData'}) paymentData: PaymentData,
   ) {
    if (!user.stripeId) {
      await this.stripeSrv.createUser(user);
    }
    const fund = (await this.fundSrv.find({id}, {isIFollow: (user) ? user.id : null}))[0];
    if (!fund || fund.payout) {
      return 'FAIL';
    }
    await this.stripeSrv.payout(paymentData, id, user, fund);
    fund.payout = true;
    fund.raisedData = new Date(Date.now() - 1000 * 60 * 60 * 3);
    await this.fundSrv.save(fund);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async followFund(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const fund = (await this.fundSrv.find({id}))[0];
    if (!fund) {
      throw new NotFoundException(HTTP_ERROR_FUND_NOT_FOUND);
    }
    if (fund.owner.id === user.id) {
      throw new BadRequestException(HTTP_ERROR_YOU_OWNER_FUND);
    }
    await this.fundSrv.follow(id, user, fund);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async unfollowFund(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const fund = (await this.fundSrv.find({id}))[0];
    if (!fund) {
      throw new NotFoundException(HTTP_ERROR_FUND_NOT_FOUND);
    }
    if (fund.owner.id === user.id) {
      throw new BadRequestException(HTTP_ERROR_YOU_OWNER_FUND);
    }
    await this.fundSrv.unfollow(id, user, fund);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async voteFund(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const fund = (await this.fundSrv.find({id}))[0];
    if (!fund) {
      throw new NotFoundException(HTTP_ERROR_FUND_NOT_FOUND);
    }
    if (fund.owner.id === user.id) {
      throw new BadRequestException(HTTP_ERROR_YOU_OWNER_FUND);
    }
    const promises = [];
    promises.push(this.fundSrv.vote(fund, user));
    if (!fund.followed) {
      promises.push(this.fundSrv.follow(id, user, fund));
    }
    await Promise.all(promises);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async unvoteFund(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const fund = (await this.fundSrv.find({id}))[0];
    if (!fund) {
      throw new NotFoundException(HTTP_ERROR_FUND_NOT_FOUND);
    }
    if (fund.owner.id === user.id) {
      throw new BadRequestException(HTTP_ERROR_YOU_OWNER_FUND);
    }
    await this.fundSrv.unvote(fund, user);
    return 'OK';
  }

  @Query(() => [FundDto])
  @UseGuards(JwtGuard)
  async getTopFunds(
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    return this.fundSrv.getTopFunds(user);
  }

  @Query(() => [UserOut])
  @UseGuards(JwtGuard)
  async getFundsSupporters(@Context(new FromContextPipe('req.user')) user: User, @Args({type: () => Int, name: 'id'}) id: number) {
    return this.fundSrv.getSupporters(id, user.id);
  }

  @Query(() => FundStat)
  @UseGuards(JwtGuard)
  async contributionStats(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number
  ): Promise<FundStat> {
    return this.fundSrv.userStats(user, id);
  }

  @Query(() => [TopFund])
  @UseGuards(JwtGuard)
  async topContributions(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number
  ) {
    return this.fundSrv.getTopThreeContributions(user, id);
  }
  
  @Mutation(() => FundDto)
  @UseGuards(JwtGuard)
  async createFund(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => GraphQLUpload, name: 'upload', nullable: true}) file: FileUpload,
    @Args('input') input: FundInputDto,
  ) {
    let s3file: ManagedUpload.SendData;
    if (file) {
      s3file = await this.fileSrv.fileUpload(file, `fund/${Date.now()}/`);
      input.photoUrl = s3file.Location;
    }
    return this.fundSrv.create(input, user);
  }

  @Mutation(() => FundDto)
  @UseGuards(JwtGuard)
  async updateFund (
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({type: () => GraphQLUpload, name: 'upload', nullable: true}) file: FileUpload,
      @Args('input') input: FundUpdateDto,
  ) {
      const fund = (await this.fundSrv.find({id: input.id}))[0];
      if (!fund) {
        throw new NotFoundException(HTTP_ERROR_FUND_NOT_FOUND);
      }
      if (fund.owner.id !== user.id) {
        throw new ForbiddenException();
      }
      let s3file: ManagedUpload.SendData;
      const oldFile = fund.photoUrl;
      if (file) {
          s3file = await this.fileSrv.fileUpload(file, `fund/${Date.now()}/`);
          await this.fileSrv.fileUpload(file, `fund/${Date.now()}/`);
          input.photoUrl = s3file.Location;
      }
      const result = await this.fundSrv.update(input, fund, user);
      if (oldFile) {
        try {
          const parts = (oldFile || '').split('/');
          await this.fileSrv.deleteFile(parts.slice(parts.length - 3).join('/'));
        } catch (e) {
          console.log(e)
        }
      }
      return result;
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async deleteFund(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const fund = (await this.fundSrv.find({id}))[0];
    if (!fund) {
      throw new NotFoundException(HTTP_ERROR_FUND_NOT_FOUND);
    }
    if (fund.owner.id !== user.id) {
      throw new ForbiddenException();
    }
    await this.fundSrv.delete(id);
    return 'OK';
  }
}
