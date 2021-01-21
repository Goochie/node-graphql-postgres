import { Injectable, HttpService } from '@nestjs/common';
import { IsNull, In, Repository, getManager, FindManyOptions, getRepository } from 'typeorm';
import { Fund } from './fund.entity';
import { DateTime } from 'luxon';
import { InjectRepository } from '@nestjs/typeorm';
import { FundInputDto } from './dto/fund-input.dto';
import { HttpErrorHelper } from '../common/helpers/http-error-helper';
import { EmailService } from '../common/services/email/email.service';
import { User } from '../user/user.entity';
import { PostcodeService } from '../postcode/postcode.service';
import { FundQuerySetting } from './dto/fund-query-setting';
import { NotificationService } from '../notification/notification.service';
import { NotificationMessage } from '../notification/notification.message';
import { StripeService } from '../common/services/stripe/stripe.service';
import { CashService } from '../common/services/cash.service';
import { FundStat } from './dto/user-stat';
import { FundUpdateDto } from './dto/fund-output.dto';

@Injectable()
export class FundService {
  constructor(
    @InjectRepository(Fund)
    private readonly fundRepository: Repository<Fund>,
    private readonly emailSrv: EmailService,
    private readonly postcode: PostcodeService,
    private readonly httpService: HttpService,
    private readonly notification: NotificationService,
    private readonly stripeSrv: StripeService,
    public readonly cash: CashService,
  ) {}

  relations = ['category', 'theme', 'owner', 'voters'];

  async find(where: any, option: FundQuerySetting = {}) {
    let localWhere;
    localWhere = [where];
    if (Array.isArray(where)) {
      localWhere = [...where];
    }
    for (const i in localWhere) {
      if (localWhere[i]) {
        if (localWhere[i].fund_followers) {
          const ids = await this.followOrgIds(localWhere[i].fund_followers);
          localWhere[i].id = In([0, ...ids]);
          delete localWhere[i].fund_followers;
        }
        localWhere[i] = { deletedDate: IsNull(), ...localWhere[i] };
      }
    }
    const queryParams: FindManyOptions = {where: localWhere, relations: this.relations};
    const funds = await this.fundRepository.find(queryParams);
    const promises = [];
    if (option.isIFollow && funds.length) {
      promises.push(this.prepareFollowed(funds, option));
      promises.push(this.prepareVoted(funds, option));
    }
    promises.push(this.getCounts(funds));
    await Promise.all(promises);
    return funds;
  }

  async getFundForCommunity(communityId, option: FundQuerySetting) {
    const postcodeIds = (await this.postcode.findCommunity(communityId)).map(p => p.id);
    postcodeIds.push(0);
    const query = this.fundRepository.createQueryBuilder('fund')
      .select()
      .leftJoin('fund.owner', 'owner')
      .leftJoin('fund.organisation', 'org')
      .where('fund.deleted_date IS NULL')
      .andWhere('fund.isPublished = true');

    query.andWhere(`
      CASE
        WHEN "org"."postcode_id" is not NULL THEN "org"."postcode_id"
        WHEN "owner"."postcode_id" is not NULL THEN "owner"."postcode_id"
      END IN (:...postcodeIds)`, {postcodeIds});

    const funds = await query.getMany();
    if (funds.length) {
      return this.find({id: In(funds.map(e => e.id))}, option);
    }
    return [];
  }

  async getTopFundForCommunity(postcode, option: FundQuerySetting) {
    let postcodeObj = (await this.postcode.findOne({postcode: postcode}));
    if(!postcodeObj) {
      return [];
    }
    const postcodeIds = (await this.postcode.findCommunity(postcodeObj.communityId)).map(p => p.id);
    postcodeIds.push(0);
    const query = this.fundRepository.createQueryBuilder('fund')
      .select()
      .leftJoin('fund.owner', 'owner')
      .leftJoin('fund.organisation', 'org')
      .where('fund.deleted_date IS NULL')
      .andWhere('fund.isPublished = true');

    query.andWhere(`
      CASE
        WHEN "org"."postcode_id" is not NULL THEN "org"."postcode_id"
        WHEN "owner"."postcode_id" is not NULL THEN "owner"."postcode_id"
      END IN (:...postcodeIds)`, {postcodeIds});

    const funds = await query.getMany();
    if (funds.length) {
      return this.find({id: In(funds.map(e => e.id))}, option);
    }
    return [];
  }

  async getFundForCommunityWithCategory(postcode, category_ids, option: FundQuerySetting) {
    let postcodeObj = (await this.postcode.findOne({postcode: postcode}));
    if(!postcodeObj) {
      return [];
    }
    const postcodeIds = (await this.postcode.findCommunity(postcodeObj.communityId)).map(p => p.id);
    postcodeIds.push(0);
    const query = this.fundRepository.createQueryBuilder('fund')
      .select()
      .leftJoin('fund.category', 'category')
      .leftJoin('fund.owner', 'owner')
      .leftJoin('fund.organisation', 'org')
      .where('fund.deleted_date IS NULL')
      .andWhere('fund.isPublished = true');
    
    if (category_ids && category_ids.length) {
      query.andWhere(`category.id IN (:...category_ids)`, {category_ids});
    }

    query.andWhere(`
      CASE
        WHEN "org"."postcode_id" is not NULL THEN "org"."postcode_id"
        WHEN "owner"."postcode_id" is not NULL THEN "owner"."postcode_id"
      END IN (:...postcodeIds)`, {postcodeIds});

    const funds = await query.getMany();
    if (funds.length) {
      return this.find({id: In(funds.map(e => e.id))}, option);
    }
    return [];

  }

  async followOrgIds(user_id: number) {
    const res = await this.fundRepository.createQueryBuilder('fund')
      .select('fund.id as fund_id')
      .innerJoinAndSelect('fund.followers', 'user')
      .where('user.id IN (:id)', {id: user_id})
      .execute();
    return res.map(r => r.fund_id);
  }

  async save(fund: Fund) {
    return this.fundRepository.save(fund);
  }

  async follow(fund_id: number, user: User, data: Fund) {
    const res = await this.fundRepository.createQueryBuilder()
      .insert()
      .into('fund_followers')
      .values([{fund_id, user_id: user.id}])
      .onConflict(` DO NOTHING`)
      .execute();
    if (res.identifiers[0]) {
      this.notification.create({
        text: NotificationMessage.entityUserJoin({user, data, type: 'fund'}),
        icon:  user.photoUrl,
        entity: 'fund',
        entity_id: data.id.toString(),
        type: 'follow',
        from: user,
      }, [...(data.followers || []), data.owner].filter(u => u.id !== user.id));
    }
  }

  async unfollow(fund_id: number, user: User, data: Fund) {
    const res = await this.fundRepository.createQueryBuilder()
      .delete()
      .from('fund_followers')
      .where([{fund_id, user_id: user.id}])
      .execute();
    if (res.affected > 0) {
      this.notification.create({
        text: NotificationMessage.entityUserLeft({user, data, type: 'fund'}),
        icon:  user.photoUrl,
        entity: 'fund',
        entity_id: data.id.toString(),
        type: 'unfollow',
        from: user,
      }, [...(data.followers || []), data.owner].filter(u => u.id !== user.id));
    }
  }

  async vote(fund: Fund, user: User) {
    if (!fund.voters) {
      fund.voters = [];
    }

    if (!fund.voters.find(v => v.id === user.id)) {
      fund.voters.push(user);
      fund.vote_count = fund.vote_count + 1;
      await this.fundRepository.save(fund);
    }
  }

  async unvote(fund: Fund, user: User) {
    if (fund.voters && fund.voters.find(v => v.id === user.id)) {
      fund.voters = fund.voters.filter(v => v.id !== user.id);
      fund.vote_count = Math.max(0, fund.vote_count - 1);
      await this.fundRepository.save(fund);
    }
  }

  async getTopFunds(user: User) {
    const postId = user.postcode.id;
    try {
      const funds = await this.fundRepository
        .createQueryBuilder('fund')
        .leftJoinAndSelect('fund.voters', 'voters')
        .leftJoinAndSelect('fund.theme', 'theme')
        .leftJoinAndSelect('fund.organisation', 'org')
        .leftJoinAndSelect('fund.owner', 'owner')
        .where('org.postcode = :postcode OR owner.postcode = :postcode')
        .andWhere('fund.deleted_date IS NULL')
        .andWhere('fund.isPublished = true')
        .orderBy('fund.vote_count', 'DESC', 'NULLS LAST')
        .limit(3)
        .setParameters({ postcode: postId })
        .getMany();

      await this.prepareVoted(funds, { isIFollow: user.id });

      return funds;
    } catch (e) {
      return [];
    }
  }

  async userStats(user: User, id: number): Promise<FundStat> {
    let pie = [];
    if(id == 0 || id == null)
      id = user.id;
    const cashed = await this.cash.get<FundStat>('USER_CONTRIBUTE_' + id, 1000 * 60 * 30);
    if (cashed) {
      return cashed;
    }
    const data = await this.stripeSrv.chargeListByUser(id);
    const total = data.reduce((a, d) => a + (+d.value), 0);
    pie = data.slice(0, 4).map(d => {
      d.value = d.value / 100;
      return d;
    });
    let funds;
    if (pie.length) {
      funds = await this.fundRepository.find({ where:
        {id: In(pie.map(a => a.fund_id))},
      });
    }

    pie.forEach((val) => {
      val.name = (funds.find(f => f.id == val.fund_id) || {title: ''}).title;
    });

    await this.cash.set('USER_CONTRIBUTE_' + id, {
      pie,
      total: total / 100,
    });

    return {
      pie,
      total: total / 100,
    };
  }

  async getTopThreeContributions(user: User, id: number) {
    if(id == 0 || id == null)
      id = user.id;
    const funds = await this.stripeSrv.getTopThreeFunds(id);
    if (funds.length) {
      const res = await this.find({id: In(funds.map(e => e.fund_id))}, {isIFollow: id});
      return this.prepareTotal(res, funds);
    }
    return [];
  }

  prepareTotal(funds, total) {
    funds.forEach((fund) => {
      fund.total = (total.find(f => f.fund_id == fund.id) || {total: 0}).total / 100;
    });
    return funds.sort((f1, f2) => {
      return f2.total - f1.total;
    });
  }

  async update(fundPath: FundUpdateDto, fund: Fund, user: User): Promise<Fund> {
    return await getManager().transaction(async transactionalEntityManager => {
      try {
        for (let key in fundPath) {
          if (fundPath[key] === undefined) {
            delete fundPath[key];
          }
        }
        if (fundPath.startDate) {
          fundPath.startDate = DateTime.fromJSDate(new Date(fundPath.startDate)).toISO();
        } else {
          if (fundPath.hasOwnProperty('startDate')) {
            fundPath.startDate = null;
          }
        }
        if (fundPath.endDate) {
          fundPath.endDate = DateTime.fromJSDate(new Date(fundPath.endDate)).toISO();
        } else {
          if (fundPath.hasOwnProperty('endDate')) {
            fundPath.endDate = null;
          }
        }
        await this.fundRepository.save({
          ...fund,
          ...fundPath,
        }, {});
      } catch (err) {
        HttpErrorHelper.checkDataBaseError(err);
        throw err;
      }
      return transactionalEntityManager.findOne(Fund, fundPath.id, {relations: this.relations});
    });
  }

  async getSupporters(fund_id: number, user_id: number): Promise<User[]> {
    const fund = (await this.find({id: fund_id}))[0];
    const going = Math.ceil(fund.follower_count / 2);
    const users = (await this.httpService.get(`https://randomuser.me/api/?results=${going}`).toPromise()).data.results;
    return users.map((u, i) => ({
      id: Date.now() + i,
      username: u.name.first + ' ' + u.name.last,
      email: u.email,
      photoUrl: u.picture.thumbnail,
    }));
  }

  async getCounts(funds: Fund[]) {
    const ids = funds.map(o => +o.id);
    if (!ids.length) {
      return;
    }
    const neadUpdateStripe = funds.filter(o => (+o.raisedData || 0 ) < Date.now() - 1000 * 60 * 60).map(f => f.id);
    const charges = await this.stripeSrv.chargeListByFunds(neadUpdateStripe);
    const query = this.fundRepository.createQueryBuilder('fund')
      .select('fund.id as fund_id')
      .leftJoin('fund.followers', 'user')
      .leftJoin('fund.updates', 'updates')
      .addSelect('count(user.id) as follower_count')
      .addSelect('count(updates.id) as updates_count')
      .where('fund.id IN (:...ids)', { ids })
      .groupBy('fund.id');
    const counters = await query.execute();
    const toSave = [];
    funds.forEach(e => {
      const charge = (charges.find(ch => ch.fund_id === e.id) || {value: 0}).value;
      const counter = (counters.find(f => f.fund_id === e.id) || {});
      e.follower_count = counter.follower_count || 0;
      e.updates_count = counter.updates_count || 0;
      if (neadUpdateStripe.includes(e.id)) {
        e.raised = charge / 100;
        e.raisedData = new Date();
        toSave.push(e);
      }
    });
    this.fundRepository.save(toSave);
  }

  async canPayout(id) {
    return this.stripeSrv.canPayout(id);
  }

  async search(coordinates: [number, number], radius: number, categories: number[], option: FundQuerySetting = {}) {
    const query = this.fundRepository.createQueryBuilder('fund')
      .select()
      .leftJoin('fund.owner', 'owner')
      .leftJoin('fund.organisation', 'org')
      .leftJoin('fund.category', 'category')
      .where('fund.deleted_date IS NULL')
      .andWhere('fund.isPublished = true');

    if (coordinates) {
      const postcodeIds = (await this.postcode.searchNear(coordinates, radius)).map(p => p.id);
      postcodeIds.push(0);
      query.andWhere(`
        CASE
          WHEN "org"."postcode_id" is not NULL THEN "org"."postcode_id"
          WHEN "owner"."postcode_id" is not NULL THEN "owner"."postcode_id"
        END IN (:...postcodeIds)`, {postcodeIds});
    }

    if (categories && categories.length) {
      query.andWhere(`category.id IN (:...categories)`, {categories});
    }

    const funds = await query.getMany();
    if (funds.length) {
      return this.find({id: In(funds.map(e => e.id))}, option);
    }
    return [];
  }

  async prepareFollowed(funds, option: FundQuerySetting) {
    const ids = funds.map(o => +o.id);
    const query = this.fundRepository.createQueryBuilder('fund')
    .select('fund.id as fund_id')
    .innerJoinAndSelect('fund.followers', 'user')
    .where('fund.id IN (:...ids)', { ids })
    .where('user.id IN (:id)', { id: option.isIFollow })
    const followers = await query.execute();
    const fids = followers.map(f => f.fund_id);
    funds.forEach(o => {
      o.followed = fids.includes(o.id);
    });
  }

  async prepareVoted(funds, option: FundQuerySetting) {
    funds.forEach(fund => {
      if (fund.voters && fund.voters.find(e => e.id === option.isIFollow)) {
        fund.voted = true;
      } else {
        fund.voted = false;
      }
    });
  }

  async create(fund: FundInputDto, user: User): Promise<Fund> {
    return await getManager().transaction(async transactionalEntityManager => {
      try {
        let newfund = new Fund({
          ...fund,
          owner: user,
        });
        if (fund.startDate) {
          newfund.startDate = DateTime.fromJSDate(new Date(fund.startDate)).toISO();
        } else {
          newfund.startDate = null;
        }
        if (fund.endDate) {
          newfund.endDate = DateTime.fromJSDate(new Date(fund.endDate)).toISO();
        } else {
          newfund.endDate = null;
        }
        newfund = await transactionalEntityManager.save(Fund, newfund);
        newfund = await transactionalEntityManager.findOne(Fund, newfund.id, {relations: this.relations});
        const title =  `Fund ${fund.title} is created`;
        this.emailSrv.sendEmail(user.email, title, 'fund_create', {fund});
        return newfund;
      } catch (err) {
        HttpErrorHelper.checkDataBaseError(err);
        throw err;
      }
    });
  }

  delete(id: number) {
    return this.fundRepository.update({ id }, {deletedDate: new Date()});
  }

}
