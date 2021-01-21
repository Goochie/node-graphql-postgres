import {Injectable, HttpService, Logger} from '@nestjs/common';
import {IsNull, In, Repository, getManager, FindManyOptions} from 'typeorm';
import {Organisation} from './organisation.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {OrganisationInputDto} from './dto/organisation-input.dto';
import {HttpErrorHelper} from '../common/helpers/http-error-helper';
import {EmailService} from '../common/services/email/email.service';
import {User} from '../user/user.entity';
import {PostcodeService} from '../postcode/postcode.service';
import {OrgQuerySetting} from './dto/org-query-setting';
import { OrganisationUpdateInputDto } from './dto/organisation-udate-input.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationMessage } from '../notification/notification.message';
import { CashService } from '../common/services/cash.service';
import { Tariff, TariffOut } from './dto/tarif';
import { PurchaseProduct } from '../common/product/purchase-product.entity';
import { PartnerStats, PartnerStatsItem } from './dto/partner.status';
import { StatusPurcheseENUM } from '../product/dto/enums/status.purchese';
import { FundService } from '../fund/fund.service';
import { Product } from '../product/product.entity';
import { RelatedUser } from '../common/dto/related-user';
import { OpeningHours } from './opening-hours.entity';

const popularCommunityCategories = ['Bakers Shops', 'Butchers', 'Green Grocers']

@Injectable()
export class OrganisationService {

    constructor(@InjectRepository(Organisation)
                private readonly organisationRepository: Repository<Organisation>,
                @InjectRepository(Product)
                private readonly productRepository: Repository<Product>,
                @InjectRepository(PurchaseProduct)
                private readonly purchaseRepository: Repository<PurchaseProduct>,
                private readonly emailSrv: EmailService,
                private readonly postcode: PostcodeService,
                private readonly notification: NotificationService,
                private readonly httpService: HttpService,
                private readonly cash: CashService,
                private readonly fundSrv: FundService,
                private readonly logger: Logger,
    ) {
    }

    relations = ['postcode', 'category', 'theme', 'owner', 'followers', 'products', 'opening'];

    async openContract( product: string, fund: number, user_id: number) {
      const purchase = this.purchaseRepository.create({
        userId: user_id,
        fund: {id: fund},
        productId: product,
        status: StatusPurcheseENUM.PAID,
      });
      await this.purchaseRepository.save(purchase);
    }

    async find(where: any, option: OrgQuerySetting = {}) {
        let localWhere;
        localWhere = [where];
        if (Array.isArray(where)) {
            localWhere = [...where];
        }
        for (const i in localWhere) {
            if (localWhere[i]) {
                if (localWhere[i].organisation_followers) {
                    const ids = await this.followOrgIds(localWhere[i].organisation_followers);
                    localWhere[i].id = In([0, ...ids]);
                    delete localWhere[i].organisation_followers;
                }
                localWhere[i] = {deletedDate: IsNull(), ...localWhere[i]};
            }
        }
        const queryParams: FindManyOptions = {where: localWhere, relations: this.relations};

        const orgs = await this.organisationRepository.find(queryParams);
        const promise = [];
        if (option.isIFollow && orgs.length) {
            promise.push(this.prepareFollowed(orgs, option));
            promise.push(this.prepareInvited(orgs, option.isIFollow));
        }
        if (orgs.length) {
          promise.push(this.counts(orgs, option));
        }
        await Promise.all(promise);
        return orgs;
    }

    async getOrganisationsByParameters(categoryName, postcodeIds, limit = 1){

      const sql = this.organisationRepository.createQueryBuilder('organisation')
            .select('organisation.id')
            .leftJoin('organisation.category', 'category')
            .leftJoin('organisation.review', 'review')
            .leftJoin('organisation.postcode', 'postcode')
            .addSelect('avg(review.rating)', 'rating')
            .where('category.name = :categoryName', {categoryName})
            .andWhere(`postcode.id IN (:...postcodeIds)`, {postcodeIds})
            .groupBy('organisation.id')
            .orderBy('rating', 'DESC', 'NULLS LAST')
            .limit(limit)
            
      return sql.getRawOne();

    }

    async findBy(findOptions, option: OrgQuerySetting = {}){
      let localWhere;
      localWhere = [findOptions.where];
      if (Array.isArray(findOptions.where)) {
          localWhere = [...findOptions.where];
      }
      for (const i in localWhere) {
          if (localWhere[i]) {
              if (localWhere[i].organisation_followers) {
                  const ids = await this.followOrgIds(localWhere[i].organisation_followers);
                  localWhere[i].id = In([0, ...ids]);
                  delete localWhere[i].organisation_followers;
              }

              if(localWhere[i].category) {
                const ids = await this.organisationCategoriesIds(localWhere[i].category);
                localWhere[i].id = In([0, ...ids]);
                delete localWhere[i].category;
              }
              localWhere[i] = {deletedDate: IsNull(), ...localWhere[i]};
          }
      }
      const queryParams: FindManyOptions = {...findOptions, where: localWhere, relations: this.relations};

      const orgs = await this.organisationRepository.find(queryParams);
      const promise = [];
      if (option.isIFollow && orgs.length) {
          promise.push(this.prepareFollowed(orgs, option));
          promise.push(this.prepareInvited(orgs, option.isIFollow));
      }
      if (orgs.length) {
        promise.push(this.counts(orgs, option));
      }
      await Promise.all(promise);
      return orgs;
    }

    async organisationCategoriesIds(ids: number | number[]){
      let categoryIds = [ids];
      if(Array.isArray(ids)){
        categoryIds = [...ids]
      }
      const res = await this.organisationRepository.createQueryBuilder('organisation')
            .select('organisation.id as organisation_id')
            .innerJoinAndSelect('organisation.category', 'category')
            .where('category.id IN (:...id)', {id: categoryIds})
      const sql = res.getSql()
      console.log('SQL')
      console.log(sql)
      console.log('SQL')

      const resE = await res.execute()
      console.log('resE')
      console.log(resE)
      console.log('resE')
      return resE.map(r => r.organisation_id);
    }

    // async getFollowers(id: number): Promise<User[]> {
    //   const res = await this.organisationRepository.createQueryBuilder('organisation')
    //     .innerJoinAndSelect('organisation.followers', 'user')
    //     .where('organisation.id = (:id)', {id})
    //     .getMany();
    //   console.log(res);
    // }

    async getOrganisationForCommunity(communityId, option: OrgQuerySetting) {
      const postcodeIds = (await this.postcode.findCommunity(communityId)).map(p => p.id);
      postcodeIds.push(0);
      const query = this.organisationRepository.createQueryBuilder('org')
        .select()
        .leftJoin('org.postcode', 'postcode')
        .where('org.deleted_date IS NULL');

      query.andWhere(`postcode.id IN (:...postcodeIds)`, {postcodeIds});

      const orgs = await query.getMany();
      if (orgs.length) {
        return this.find({id: In(orgs.map(e => e.id))}, option);
      }
      return [];
    }

    async getFunds(org_id: number, user: User): Promise<PartnerStats> {
      const fundsStat: PartnerStatsItem[] = [];
      const indexMap = new Map();
      let total = 0;
      const products = (await this.productRepository.createQueryBuilder('product')
        .select()
        .where({org_id})
        .leftJoinAndSelect('product.purchases', 'purchases')
        .leftJoinAndSelect('purchases.fund', 'fund')
        .getMany()) as any[];

      products.forEach((pr: Product) => {
        pr.purchases.forEach((pur: PurchaseProduct) => {
          let index = indexMap.get(pur.fund.id);
          if (!indexMap.has(pur.fund.id)) {
            fundsStat.push({
              value: pr.cost * pr.contribution / 100,
              name: pur.fund.title,
            });
            index = fundsStat.length - 1;
            indexMap.set(pur.fund.id, index);
          } else {
            fundsStat[index].value = fundsStat[index].value + (pr.cost * pr.contribution / 100);
          }
          total += fundsStat[index].value;
        });
      });


      const funds = await this.fundSrv.find({id: In(Array.from( indexMap.keys() ))}, {isIFollow: user.id});
      for (const fund of funds) {
        fundsStat[indexMap.get(fund.id)].fund = fund;
      }

      return {
        total,
        funds: fundsStat.sort((a, b) => a.value - b.value),
      };
    }

    async getOrgMembers(id: number) {
      const res = await this.organisationRepository.findOne(id, { relations: ['members'] });
      return res.members;
    }

    removeOrgMember(org_id: number, user_id: number) {
      return this.organisationRepository.createQueryBuilder()
        .delete()
        .from('organisation_members')
        .where([{ org_id, user_id }])
        .execute();
    }

    async inviteOrgMembers(owner: User, org: Organisation, users: RelatedUser[]) {
      const res = await this.organisationRepository.createQueryBuilder()
            .insert()
            .into('organisation_invited_users')
            .values(users.map(user => ({org_id: org.id, user_id: user.id})))
            .onConflict(` DO NOTHING`)
            .execute();

      const promises = users.map(u => this.emailSrv.sendEmail(u.email, 'Invite to SLP', 'invite',
        {user: u, link: `https://www.smartlifepath.com/dash-board/approve-org-invite/${org.id}/${u.id}`}));
      await Promise.all(promises);
      this.notification.inviteTo('organisation', org.id, org.title, users, owner);
    }

    async joinOrganisation(org_id: number, user: User, data: Organisation) {
      const res = await this.organisationRepository.createQueryBuilder()
          .delete()
          .from('organisation_invited_users')
          .where([{org_id, user_id: user.id}])
          .execute();

      if (res.affected > 0) {
        await this.organisationRepository.createQueryBuilder()
          .insert()
          .into('organisation_members')
          .values([{org_id, user_id: user.id}])
          .onConflict(` DO NOTHING`)
          .execute();

        this.notification.create({
          text: NotificationMessage.acceptInvitation({user, data, type: 'organisation'}),
          icon:  user.photoUrl,
          entity: 'organisation',
          entity_id: data.id.toString(),
          type: 'join',
          from: user,
        }, [...(data.members || []), data.owner].filter(u => u.id !== user.id));
      }
    }

    async declineInvitation(org_id: number, user: User, data: Organisation) {
      const res = await this.organisationRepository.createQueryBuilder()
          .delete()
          .from('organisation_invited_users')
          .where([{org_id, user_id: user.id}])
          .execute();
      if (res.affected > 0) {
        this.notification.create({
          text: NotificationMessage.declineInvitation({user, data, type: 'organisation'}),
          icon:  user.photoUrl,
          entity: 'organisation',
          entity_id: data.id.toString(),
          type: 'join',
          from: user,
        }, [...(data.members || []), data.owner].filter(u => u.id !== user.id));
      }
    }

    async followOrgIds(user_id: number) {
        const res = await this.organisationRepository.createQueryBuilder('organisation')
            .select('organisation.id as organisation_id')
            .innerJoinAndSelect('organisation.followers', 'user')
            .where('user.id IN (:id)', {id: user_id})
            .execute();
        return res.map(r => r.organisation_id);
    }

    async follow(org_id: number, user: User, data: Organisation) {
        const res = await this.organisationRepository.createQueryBuilder()
            .insert()
            .into('organisation_followers')
            .values([{org_id, user_id: user.id}])
            .onConflict(` DO NOTHING`)
            .execute();
        if (res.identifiers[0]) {
          this.notification.create({
            text: NotificationMessage.entityUserJoin({user, data, type: 'organisation'}),
            icon:  user.photoUrl,
            entity: 'organisation',
            entity_id: data.id.toString(),
            type: 'follow',
            from: user,
          }, [...(data.followers || []), data.owner].filter(u => u.id !== user.id));
        }
    }

    async getTarifs(): Promise<TariffOut[]> {
      const cash = await this.cash.get<TariffOut[]>('tarifs-energy', 1000 * 60 * 60 * 20);
      if (cash) {
        return cash;
      }

      const data = (await this.httpService.get<Tariff[]>('https://api.bulb.co.uk/comparison_chart/data')
        .toPromise()).data.map(d => ({
        name: d.label.tariff,
        value: d.data[0],
        organisation: d.label.supplier,
      })).sort((a, b) => a.value - b.value);

      await this.cash.set('tarifs-energy', data);

      return data;
    }

    async unfollow(org_id: number, user: User, data: Organisation) {
        const res = await this.organisationRepository.createQueryBuilder()
            .delete()
            .from('organisation_followers')
            .where([{org_id, user_id: user.id}])
            .execute();
        if (res.affected > 0) {
          this.notification.create({
            text: NotificationMessage.entityUserLeft({user, data, type: 'organisation'}),
            icon:  user.photoUrl,
            entity: 'organisation',
            entity_id: data.id.toString(),
            type: 'unfollow',
            from: user,
          }, [...(data.followers || []), data.owner].filter(u => u.id !== user.id));
        }
    }

    async counts(orgs, option: OrgQuerySetting) {
      const ids = orgs.map(o => +o.id);
      const query = this.organisationRepository.createQueryBuilder('organisation')
          .select('organisation.id as organisation_id')
          .leftJoin('organisation.review', 'review')
          .addSelect('avg(review.rating)', 'rating')
          .addSelect('count(DISTINCT review.id)', 'reviews')
          .leftJoin('organisation.funds', 'fund')
          .addSelect('count(DISTINCT fund.id)', 'funds')
          .leftJoin('organisation.updates', 'update')
          .addSelect('count(DISTINCT update.id)', 'updates')
          .leftJoin('organisation.events', 'event')
          .addSelect('count(DISTINCT event.id)', 'events')
          .where('organisation.id IN (:...ids)', {ids})
          .groupBy('organisation.id');
      const ratings = await query.execute();
      orgs.forEach(o => {
          const data = (ratings.find(r => r.organisation_id === o.id) || {rating: 0, reviews: 0, events: 0, funds: 0});
          o.rating = data.rating;
          o.reviewCount = data.reviews;
          o.eventsCount = data.events;
          o.fundCount = data.funds;
          o.updateCount = data.updates;
      });
    }

    async prepareFollowed(orgs, option: OrgQuerySetting) {
        const ids = orgs.map(o => +o.id);
        const query = this.organisationRepository.createQueryBuilder('organisation')
            .select('organisation.id as organisation_id')
            .innerJoinAndSelect('organisation.followers', 'user')
            .where('organisation.id IN (:...ids)', {ids})
            .andWhere('user.id IN (:id)', {id: option.isIFollow})
        const followers = await query.execute();
        const fids = followers.map(f => f.organisation_id);
        orgs.forEach(o => {
            o.followed = fids.includes(o.id);
        });
    }

    async prepareInvited(orgs, user_id: number) {
      const ids = orgs.map(o => +o.id);
      const query = this.organisationRepository.createQueryBuilder('organisation')
          .select('organisation.id as organisation_id')
          .innerJoinAndSelect('organisation.invitedUsers', 'user')
          .where('organisation.id IN (:...ids)', {ids})
          .andWhere('user.id IN (:id)', {id: user_id});
      const followers = await query.execute();
      const fids = followers.map(f => f.organisation_id);
      orgs.forEach(o => {
          o.invited = fids.includes(o.id);
      });
  }

    async create(org: OrganisationInputDto, user: User): Promise<Organisation> {
        return await getManager().transaction(async transactionalEntityManager => {
            try {
                org.email = org.email.toLowerCase();
                org.postcode = org.postcode.replace(/ /g, '').toUpperCase();
                let newOrg = new Organisation({
                    ...org,
                    owner: user,
                    postcode: await this.postcode.findOrCreate(org.postcode, transactionalEntityManager)
                });
                newOrg = await transactionalEntityManager.save(newOrg);
                if(org.opening) {
                  for(const day of org.opening) {
                    await transactionalEntityManager.save(OpeningHours, new OpeningHours({
                      ...day,
                      organisation: newOrg
                    }));
                  }
                }
                newOrg = await transactionalEntityManager.findOne(Organisation, newOrg.id, {relations: this.relations});
                const title = `Organisation ${org.title} is created`;
                this.emailSrv.sendEmail(user.email, title, 'organisation_create', {org});
                if (org.email && org.email !== user.email) {
                    this.emailSrv.sendEmail(org.email, title, 'organisation_create', {org});
                }
                return newOrg;
            } catch (err) {
                HttpErrorHelper.checkDataBaseError(err);
                throw err;
            }
        });
    }

    async update(org: OrganisationUpdateInputDto, organisation: Organisation, user: User): Promise<Organisation> {
      return await getManager().transaction(async transactionalEntityManager => {
        try {
          for (let key in org) {
            if (org[key] === undefined) {
              delete org[key];
            }
          }
          let newPostCode = organisation.postcode;
          if (org.postcode) {
            newPostCode = await this.postcode.findOrCreate(org.postcode, transactionalEntityManager);
          } else if (org.postcode === '') {
            org = null;
          }
          await transactionalEntityManager.save(Organisation, {
            ...organisation,
            ...org,
            postcode: newPostCode,
          }, {});
        } catch (err) {
          HttpErrorHelper.checkDataBaseError(err);
          throw err;
        }
        return await transactionalEntityManager.findOne(Organisation, org.id, {relations: this.relations});
      });
    }

    async search(coordinates: [number, number], radius: number, categories: number[], option: OrgQuerySetting = {}) {
      const query = this.organisationRepository.createQueryBuilder('organisation')
        .select()
        .leftJoin('organisation.postcode', 'postcode')
        .leftJoin('organisation.category', 'category')
        .where('deleted_date IS NULL')
        .andWhere('partner = false');

      if (coordinates) {
        const postcodeIds = (await this.postcode.searchNear(coordinates, radius)).map(p => p.id);
        postcodeIds.push(0);
        query.andWhere(`postcode.id IN (:...postcodeIds)`, {postcodeIds});
      }

      if (categories && categories.length) {
        query.andWhere(`category.id IN (:...categories)`, {categories});
      }

      const orgs = await query.getMany();
      if (orgs.length) {
        return this.find({id: In(orgs.map(e => e.id))}, option);
      }
      return [];
    }

    delete(id: number) {
        return this.organisationRepository.update({id}, {deletedDate: new Date()});
    }

    private async _getPopularOrganisation(name, postcodes: number[]){
  
      const orgId = await this.getOrganisationsByParameters(name, postcodes);
      let org = null;

      if(orgId){
        org = await this.organisationRepository.findOne({id: orgId.organisation_id}, {relations: this.relations})
      }
  
      return org;
    }

    async getPropularOrganisationsInCommunity(user: User){
      const userCommunityPostcodes = await this.postcode.findCommunity(user.postcode.communityId);
      const userCommunityPostcodesIds = userCommunityPostcodes.map(postcode => postcode.id);
      const additionalPostcodeIds = await this.postcode.getPostcodesWithIncreasedRadius(userCommunityPostcodes);
      const flattenPostcodes = additionalPostcodeIds.flat();

      const organisationPromises = popularCommunityCategories.map(categoryName => {
        return this._getPopularOrganisation(categoryName, userCommunityPostcodesIds);
      })

      let [baker, butcher, grocer] = await Promise.all(organisationPromises);

      if (!baker){
        baker = await this._getPopularOrganisation(popularCommunityCategories[0], flattenPostcodes);
      }
      if (!butcher){
        butcher = await this._getPopularOrganisation(popularCommunityCategories[1], flattenPostcodes);
      }
      if (!grocer){
        grocer = await this._getPopularOrganisation(popularCommunityCategories[2], flattenPostcodes);
      }


      this.logger.log(baker, 'BAKCER')
      this.logger.log(butcher, 'BUTCHER')
      this.logger.log(grocer, 'GROCER')

      return [baker, butcher, grocer].filter(Boolean);
    }

}
