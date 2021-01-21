import { Injectable } from '@nestjs/common';
import { IsNull, In, Repository, getManager, FindManyOptions, DeepPartial } from 'typeorm';
import { Review } from './review.entity';
import { DateTime } from 'luxon';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewInputDto } from './dto/review-input.dto';
import { HttpErrorHelper } from '../common/helpers/http-error-helper';
import { EmailService } from '../common/services/email/email.service';
import { User } from '../user/user.entity';
import { PostcodeService } from '../postcode/postcode.service';
import { EntityMap } from '../common/dto/entety-map';
import { ReviewParamsInputDto } from './dto/review-params-input';
import * as uuid from 'uuid/v4';
import { NotificationMessage } from '../notification/notification.message';
import { NotificationService } from '../notification/notification.service';
import * as _ from 'lodash';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly emailSrv: EmailService,
    private readonly postcode: PostcodeService,
    private readonly notifi: NotificationService,
  ) {}

  relations = ['organisation', 'organisation.theme', 'community', 'user'];

  async getReviewsFor(params: ReviewParamsInputDto) {
    const where: any = {};
    where[EntityMap[params.entity].relation] = params.id;
    where.parent_id = IsNull();

    const review = await this.reviewRepository.find({where, relations: this.relations, order: {createdDate: 'DESC'}});
    return await this.getChildCounts(review);
  }

  async getChildReviews(id: string) {
    const review = await this.reviewRepository.find({where: {parent_id: id}, relations: this.relations, order: {createdDate: 'DESC'}});
    return await this.getChildCounts(review);
  }

  async getChildCounts(review: Review[]) {
    const ids = review.map(u => u.id);
    if (ids.length) {
      const counts = await this.reviewRepository.createQueryBuilder()
        .select(`parent_id`, 'id')
        .addSelect(`count(parent_id)`, 'count')
        .where(`parent_id IN (:...ids)`, {ids})
        .groupBy('parent_id')
        .execute();
      review.forEach(u => {
        u.children_count = (counts.find(c => c.id === u.id) || {}).count || 0;
      });
    }
    return review;
  }

  async find(where) {
    return this.reviewRepository.find({where });
  }

  async create(review: ReviewInputDto, user: User): Promise<Review> {
    return await getManager().transaction(async transactionalEntityManager => {
      try {
        const date: any = {...review, user: {id: user.id}};
        let newreview = this.reviewRepository.create(date as DeepPartial<Review>);
        newreview.id = uuid();
        newreview = await transactionalEntityManager.save(Review, newreview);
        newreview = await transactionalEntityManager.findOne(Review, newreview.id, {
          relations: [...this.relations, 'organisation.owner', 'parent', 'parent.user', 'product']});
        await this.createNotify(newreview, user);

        return newreview;
      } catch (err) {
        HttpErrorHelper.checkDataBaseError(err);
        throw err;
      }
    });
  }

  private _getEntityName(newreview: Review) {
    const {organisation_id, product_id} = newreview;

    switch (true){
      case Boolean(organisation_id):
        return 'organisation';
      case Boolean(product_id):
        return 'product';
      default:
        return 'organisation';
    }
  }

  private _getPhotoUrlForNotification(newreview: Review, entityName: string) {
    const photoUrlPaths = {
      'product': ['product.photo_url'],
      'organisation': ['organisation.photoUrl', 'organisation.theme.url']
    }

    const paths = photoUrlPaths[entityName];

    const photoUrls = paths.map((path: string) => _.get(newreview, path, false)).filter(Boolean);

    const url = _.head(photoUrls);

    return url;
  }

  private _getNotificationParameters(newreview: Review, entityName: string, user: any) {

    return {
      icon:  this._getPhotoUrlForNotification(newreview, entityName),
      entity: entityName,
      entity_id: _.get(newreview, `${entityName}.id`, '').toString(),
      type: 'review',
      from: user,
    };
  }

  private _getUsersForNotification(newreview: Review, entityName: string) {
    const ownerPaths = {
      'product': ['product.profile','product.org'],
      'organisation': ['organisation.owner']
    }

    const paths = ownerPaths[entityName];

    const users = paths.map((path: string) => _.get(newreview, path, false)).filter(Boolean);

    return users;
  }

  async createNotify(newreview: Review, user) {
    let repleyTo: User;
    const parent = await newreview.parent;
    if (parent) {
      repleyTo = parent.user;
    }
    const entetyName = this._getEntityName(newreview);

    const params = this._getNotificationParameters(newreview, entetyName, user)

    let users = this._getUsersForNotification(newreview, entetyName);
    if (repleyTo) {
      users = users.filter(u => repleyTo.id !== u.id);
      await this.notifi.create({
        text: NotificationMessage.reviewReplay({user, data: newreview[entetyName]}),
        ...params,
      }, [repleyTo]);
    }

    await this.notifi.create({
      text: NotificationMessage.entityHasReview({user, data: newreview[entetyName]}),
      ...params,
    }, users);
  }

  delete(id: string) {
    return this.reviewRepository.delete({ id });
  }

}
