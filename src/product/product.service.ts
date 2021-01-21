import { Injectable, HttpService, Logger } from '@nestjs/common';
import {
  IsNull,
  In,
  Repository,
  getManager,
  FindManyOptions,
  SelectQueryBuilder,
  UpdateResult,
  getConnection,
  Brackets,
} from 'typeorm';
import { Product } from './product.entity';
import { DateTime } from 'luxon';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { ProductInputDto } from './dto/product-input.dto';
import { HttpErrorHelper } from '../common/helpers/http-error-helper';
import { EmailService } from '../common/services/email/email.service';
import { User } from '../user/user.entity';
import { PostcodeService } from '../postcode/postcode.service';
import { NotificationService } from '../notification/notification.service';
import { ProductUpdateDto } from './dto/product-update.dto';
import { DeliverySettings } from './delivery-setings.entity';
import { DeliverySettingsInput } from './dto/delivery-setings.input';
import { Tags } from './tags.entity';
import { FileService } from '../common/services/file/file.service';
import { ProductFilter } from './dto/productFilter';
import { queue } from 'rxjs/internal/scheduler/queue';
import { Query } from 'type-graphql';
import { DeliverySettingsOut } from './dto/delivery-setings.dto';
import { Category } from '../categories/category.entity';
import { SearchCategoryTagEnum } from './dto/enums/search-category-tag';
import { SearchCategoryTag } from './dto/search-category-tag.dto';
import { ProductSearchDto } from './dto/product-search.dto';
import { OrganisationService } from '../organisation/organisation.service';
import { PostCode } from '../postcode/post-code.entity';
import { CategoryService } from '../categories/category.service';

const storeHomeDataCategories = {
  localBusiness: ["Green Grocers", "Bakers Shops", "Fish Monger", "Butchers"],
  localFoods: ["Veg Box", "Bread", "Meat Box", "Fish Box"],
  localHelps: ["Laundry and Ironing", "Errands",  "IT repairs", "Home"],
  childrenActivities: ["Arts and crafts", "Primary learning"],
}
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Tags)
    private readonly tagRepository: Repository<Tags>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(DeliverySettings)
    private readonly deliveryRepository: Repository<DeliverySettings>,
    private readonly fileService: FileService,
    private readonly logger: Logger,
    private readonly postcode: PostcodeService,
    private readonly organisationService: OrganisationService,
    private readonly categoryService: CategoryService,
  ) {}

  relations = ['org', 'category', 'profile', 'delivery', 'tags', 'review', 'postcode'];

  queryHead() {
    const query = this.productRepository.createQueryBuilder('product').select();
    this.relations.forEach(r => query.leftJoinAndSelect(`product.${r}`, r));
    return query;
  }

  async findFor(user: User, id: number, entity: string, filter: ProductFilter, searchTxt: string) {
    const query = this.productRepository.createQueryBuilder('product').select();
    query.leftJoinAndSelect(`product.${entity}`, entity);
    query.where({ [entity]: { id } });
    query.andWhere('product.deletedDate IS NULL');

    if (searchTxt && searchTxt !== '') {
      // query.leftJoinAndMapOne('product.tags', 'product_tag', 't2', 't2.tag like (:searchTxt)', {searchTxt: `%${searchTxt}%`});
      query.andWhere(new Brackets(qb => {
          qb.where('product.name like (:searchTxt)', {searchTxt: `%${searchTxt}%`})
            .orWhere('product.description like (:searchTxt)', {searchTxt: `%${searchTxt}%`})
            .orWhere('product.sku like (:searchTxt)', {searchTxt: `%${searchTxt}%`})
            .orWhere('product.who_made like (:searchTxt)', {searchTxt: `%${searchTxt}%`})
      }));
    }
    if (filter.categoryes && filter.categoryes.length) {
      query.leftJoinAndSelect(`product.category`, 'category');
      query.andWhere('category.id IN (:...categories)', {
        categories: filter.categoryes,
      });
    }
    if (filter.itemType) {
      query.andWhere('product.itemType = (:itemType)', {
        itemType: filter.itemType,
      });
    }
    const prodicts = await query.getMany();
    const finalQuery = this.queryHead();
    if (!prodicts.length) {
      return [];
    }
    finalQuery.where({ id: In(prodicts.map(a => a.id)) });
    const products = await finalQuery.getMany();
    const productsWithTags = products.map(product => {
      return {
        ...product,
        tags: product.tags.map(tag => tag.tag),
      };
    });
    return productsWithTags;
  }

  async topListings(id: number, itemType: string) {
    const query = this.productRepository.createQueryBuilder('product').select();
    query.where('product.profile_id = (:profile_id)', { profile_id: id });
    query.andWhere('product.itemType = (:itemType)', { itemType: itemType });
    query.andWhere('product.deletedDate IS NULL');
    query.orderBy();
    query.limit(3);
    return await query.getMany();
  }

  async batch(ids: string[], doAction: 'delete' | 'deactivate' | 'renew') {
    const query = this.productRepository.createQueryBuilder('product').update();

    switch (doAction) {
      case 'delete':
        query.set({ deletedDate: Date() });
        break;
      case 'deactivate':
        query.set({ active: false });
        break;
      case 'renew':
        query.set({ active: true });
        break;
    }

    return query.where('id IN (:...ids)', { ids }).execute();
  }

  async clone(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: this.relations,
    });
    if (!product.delivery.reuse) {
      let newDS = product.delivery;
      delete newDS.id;
      newDS = await this.deliveryRepository.save(newDS);
      product.delivery = { id: newDS.id };
    }
    delete product.id;
    const newProduct =  await this.productRepository.save(product);
    const productWithTags = {
        ...newProduct,
        tags: newProduct.tags.map(tag => tag.tag),
    };

    return productWithTags;
  }

  async find(where: any) {
    let localWhere;
    localWhere = [where];
    if (Array.isArray(where)) {
      localWhere = [...where];
    }
    for (const i in localWhere) {
      if (localWhere[i]) {
        localWhere[i] = { deletedDate: IsNull(), ...localWhere[i] };
      }
    }
    const queryParams: FindManyOptions = {
      where: localWhere,
      relations: this.relations,
    };
    const query = this.productRepository
      .createQueryBuilder('product')
      .select()
      .where(queryParams.where);
    queryParams.relations.forEach(re => {
      query.leftJoinAndSelect(`product.${re}`, re);
    });
    const products = await query.getMany();
    const productsWithTags = products.map(product => {
      return {
        ...product,
        tags: product.tags.map(tag => tag.tag),
      };
    });
    const promises = [];
    await Promise.all(promises);
    return productsWithTags;
  }

  async create(
    product: ProductInputDto,
    delivery: DeliverySettingsInput,
    user: User,
  ): Promise<Product> {
    return await getManager().transaction(async transactionalEntityManager => {
      try {
        let newProduct = new Product();
        const postcode = product.postcode.replace(/ /g, '').toUpperCase();
        Object.assign(newProduct, product);

        if(postcode.length > 0){
          newProduct.postcode =  await this.postcode.findOrCreate(postcode, transactionalEntityManager)
        }else{
          newProduct.postcode = null
        }

        if (newProduct.photoUrls && newProduct.photoUrls.length) {
          const files = [];
          for (let file of newProduct.photoUrls) {
            const parts = (decodeURIComponent(file) || '').split('/');
            const newFile = await this.fileService.copyFile(
              'product/' + parts[parts.length - 1],
              parts.slice(3).join('/'),
            );
            files.push(newFile.Location);
          }
          newProduct.photoUrls = files;
        }

        if (delivery) {
          let newDelivery;
          if(delivery.id){
            newDelivery = await this.deliveryRepository.update(delivery.id, delivery)
          }else{
            newDelivery = new DeliverySettings();
            newDelivery.user = { id: user.id };
            Object.assign(newDelivery, delivery);
            newDelivery = await transactionalEntityManager.save(
              DeliverySettings,
              newDelivery,
          );
          }
          newProduct.delivery = { id: newDelivery.id };
        }

        if (product.tags) {
          const tags: Array<Partial<Tags>> = product.tags.map(t => ({
            tag: t,
          }));
          newProduct.tags = (await transactionalEntityManager
            .createQueryBuilder()
            .insert()
            .into(Tags)
            .values(tags)
            .onConflict('("tag") DO UPDATE SET tag=EXCLUDED.tag')
            .execute()).identifiers as Tags[];
        }
        newProduct = await transactionalEntityManager.save(Product, newProduct);
        newProduct = await transactionalEntityManager.findOne(
          Product,
          newProduct.id,
          { relations: this.relations },
        );

        newProduct = {
          ...newProduct,
          tags: newProduct.tags.map(tag => {
            const newTag = tag as any;
            return newTag.tag;
          }),
        };
        return newProduct;
      } catch (err) {
        this.logger.error(err, ProductService.name);
        HttpErrorHelper.checkDataBaseError(err);
        throw err;
      }
    });
  }

  async update(product: ProductUpdateDto): Promise<any> {
    return await getManager().transaction(async transactionalEntityManager => {
      try {
        let newProduct = new Product();
        Object.assign(newProduct, product);

        if (newProduct.photoUrls && newProduct.photoUrls.length) {
          const files = [];
          for (let file of newProduct.photoUrls) {
            const parts = (decodeURIComponent(file) || '').split('/');
            const newFile = await this.fileService.copyFile(
              'product/' + parts[parts.length - 1],
              parts.slice(3).join('/'),
            );
            files.push(newFile.Location);
          }
          newProduct.photoUrls = files;
        }

        let newPostCode = newProduct.postcode;
        newPostCode = await this.postcode.findOrCreate(product.postcode.postcode, transactionalEntityManager);

        if (product.tags) {
          const tags: Array<Partial<Tags>> = product.tags.map(t => ({
            tag: t,
          }));
          newProduct.tags = (await transactionalEntityManager
            .createQueryBuilder()
            .insert()
            .into(Tags)
            .values(tags)
            .onConflict('("tag") DO UPDATE SET tag=EXCLUDED.tag')
            .execute()).identifiers as Tags[];
        }

        const { id, ...productToUpdate } = newProduct;
        const existedProduct = await transactionalEntityManager.findOne(
          Product,
          id,
        );

        const merged = await transactionalEntityManager.merge(
          Product,
          existedProduct,
          productToUpdate,
        );
        await transactionalEntityManager.save(Product, {
          ...merged,
          postcode: newPostCode
        });
        let updatedProduct = await transactionalEntityManager.findOne(
          Product,
          id,
          { relations: this.relations },
        );

        updatedProduct = {
          ...updatedProduct,
          tags: updatedProduct.tags.map(tag => {
            const newTag = tag as any;
            return newTag.tag;
          }),
        };

        return updatedProduct;
      } catch (err) {
        console.error(err);
        HttpErrorHelper.checkDataBaseError(err);
        throw err;
      }
    });
  }

  private async _getProductsCategories() {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect(
        'product_categories',
        'pc',
        'product.id = pc.product_id',
      )
      .leftJoinAndSelect('category', 'cat', 'cat.id = pc.category_id')
      .where('cat.id IS NOT NULL')
      .distinctOn(['cat.id'])
      .select(['cat.id', 'cat.name', 'cat.parent', 'cat.type'])
      .getRawMany();
  }

  private async _getProductsTags() {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product_tags', 'pt', 'product.id = pt.product_id')
      .leftJoinAndSelect('product_tag', 'tag', 'tag.id = pt.tags_id')
      .where('tag.id IS NOT NULL')
      .distinctOn(['tag.id'])
      .select(['tag.id', 'tag.tag'])
      .getRawMany();
  }

  async getProductsCategoriesAndTags() {
    const categoriesPromise = this._getProductsCategories();

    const tagsPromise = this._getProductsTags();

    const [categories, tags] = await Promise.all([
      categoriesPromise,
      tagsPromise,
    ]);

    const searchCategories = categories.map(cat => {
      const newCategory = {
        id: cat.cat_id,
        name: cat.cat_name,
        searchType: SearchCategoryTagEnum.CATEGORY,
        categoryType: cat.cat_type,
      };

      return newCategory as SearchCategoryTag;
    });

    const searchTags = tags.map(tag => {
      const newTag = {
        id: tag.tag_id,
        name: tag.tag_tag,
        searchType: SearchCategoryTagEnum.TAG,
        categoryType: 'TAG',
      };

      return newTag as SearchCategoryTag;
    });

    const searchEntities = [...searchCategories, ...searchTags];

    return searchEntities;
  }

  delete(id: string) {
    return this.productRepository.update({ id }, { deletedDate: new Date() });
  }

  async searchStore(input: ProductSearchDto) {
    const { categories, items, services, sort, skip = 0, take = 16, location, searchString } = input;
    let postcodeIds = [0];

    const byCategoryes = categories.filter(
      cat => cat.searchType && cat.searchType === 'CATEGORY',
    );
    const byTags = categories.filter(cat => cat.searchType === 'TAG');
    
    if (location.coordinates) {
      const radius = location.radius ? location.radius : null;
      const existedPostcodeIds = (await this.postcode.searchNear(
        location.coordinates as [number, number],
        radius,
      )).map(p => p.id);

      postcodeIds.push(...existedPostcodeIds);

      
    }

    const products = getConnection()
      .createQueryBuilder()
      .select(['subselect.product_id', 'subselect.product_cost', 'subselect.product_contribution'])
      .from(subQuery => {
        subQuery
          .select(['product.id', 'product.cost', 'product.contribution'])
          .from(Product, 'product')
          .leftJoinAndSelect(
            'product_categories',
            'pc',
            'product.id = pc.product_id',
          )
          .leftJoinAndSelect('product_tags', 'pt', 'product.id = pt.product_id')
          .leftJoinAndSelect('product.postcode', 'postcode')
          .leftJoinAndSelect('product.profile', 'profile')
          .leftJoinAndSelect('product.org', 'org')
          .where('product.deleted_date IS NULL')
          .andWhere('product.itemType IN (:...types)', {
            types: ['PHYSICAL', 'SERVICE'],
          });

        if(location.coordinates){
          subQuery.andWhere(new Brackets(qb => {
            qb.where(`postcode.id IN (:...postcodeIds)`, {
              postcodeIds,
            });
            qb.orWhere(`profile.postcode_id IN (:...postcodeIds)`, {
              postcodeIds,
            });
            qb.orWhere(`org.postcode_id IN (:...postcodeIds)`, {
              postcodeIds,
            });
          }))
          // subQuery.andWhere(`postcode.id IN (:...postcodeIds)`, {
          //   postcodeIds,
          // });
        }

        if(searchString){
          subQuery.andWhere(new Brackets(qb => {
            qb.where('LOWER(product.name) LIKE :searchString', {searchString: `%${searchString.toLowerCase()}%`});
            qb.orWhere('LOWER(product.description) LIKE :searchString', {searchString: `%${searchString.toLowerCase()}%`})
          }))
        }
          
        if (byCategoryes.length || byTags.length) {
          subQuery.andWhere(
            new Brackets(qb => {
              if (byCategoryes.length) {
                qb.orWhere('pc.category_id IN (:...categoryIds)', {
                  categoryIds: byCategoryes.map(cat => cat.id),
                });
              }
              if (byTags.length) {
                qb.orWhere('pt.tags_id IN (:...tagIds)', {
                  tagIds: byTags.map(cat => cat.id),
                });
              }
            }),
          );
        }

        if(!items){
          subQuery.andWhere("product.itemType != 'PHYSICAL'")
        }

        if(!services){
          subQuery.andWhere("product.itemType != 'SERVICE'");
        }

        subQuery.distinctOn(['product.id']);

        return subQuery;
      }, 'subselect')

      if (sort) {
        products.orderBy(`subselect.product_${sort.field}`, sort.direction);
      }
      

    const countResults = await products.getRawMany()

    products.skip(skip);
    products.take(take);

    const results = await products.getRawMany()
    const sql = products.getSql();
    const params = products.getQueryAndParameters()
    const count = countResults.length;

    const hydrated = await Promise.all(results.map(async (item) => {
      const hydrate = await this.productRepository.findOne(item.product_id, { relations: ["review", "org", "profile"] });
      return hydrate;
    }))
    const cursor = take >= count ? count : take;
    return {
      data: hydrated,
      meta: {
        cursor: cursor,
        total: count,
      }
    };
  }

  private async _getOrganisationsForStoreHomeData(names: string[], postcodes: number[]){
    const idPromises = names.map(name => {
      return this.organisationService.getOrganisationsByParameters(name, postcodes);
    })

    const orgIds = await Promise.all(idPromises);

    const orgsPromises = orgIds.map(orgId => {
      if(orgId){
        return this.organisationService.find({id: orgId.organisation_id})
      }else {
        return null;
      }
    })

    const orgs = await Promise.all(orgsPromises);
    const filteredOrgs = orgs.filter(Boolean).map(org => org[0])

    return filteredOrgs;
  }

  private async _getProductForStoreHomeData(categoryName: string, postcodeIds: number[], limit = 1){
    let hydrate = null;
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .leftJoin('product.review', 'review')
      .leftJoin('product.postcode', 'postcode')
      .leftJoin('product.profile', 'profile')
      .leftJoin('product.org', 'org')
      .addSelect('avg(review.rating)', 'rating')
      .where('category.name = :categoryName', {categoryName})
      .groupBy('product.id')
      .orderBy('rating', 'DESC', 'NULLS LAST')
      .limit(limit)
      .andWhere(new Brackets(qb => {
        qb.where(`postcode.id IN (:...postcodeIds)`, {
          postcodeIds,
        });
        qb.orWhere(`profile.postcode_id IN (:...postcodeIds)`, {
          postcodeIds,
        });
        qb.orWhere(`org.postcode_id IN (:...postcodeIds)`, {
          postcodeIds,
        });
      }))

    const product = await query.getOne();

    if(product){
      hydrate = this.productRepository.findOne(product.id, { relations: ["review", "org", "profile"] });
    }
    return hydrate;
  }

  private async _getProuctsForStoreHomeData(categoryNames: string[], postcodeIds: number[]){
    const productsPromises = categoryNames.map(name => {
      return this._getProductForStoreHomeData(name, postcodeIds);
    })

    const products = await Promise.all(productsPromises);

    const filteredProducts = products.filter(Boolean);

    return filteredProducts;
  }

  async getStoreHomeData(user: User) {
    const userCommunityPostcodes = await this.postcode.findCommunity(user.postcode.communityId);
    const userCommunityPostcodesIds = userCommunityPostcodes.map(postcode => postcode.id);
    const additionalPostcodeIds = await this.postcode.getPostcodesWithIncreasedRadius(userCommunityPostcodes);
    const flattenPostcodes = additionalPostcodeIds.flat();

    const productPromises = [];
    productPromises.push(this._getOrganisationsForStoreHomeData(storeHomeDataCategories.localBusiness, userCommunityPostcodesIds));
    productPromises.push(this._getProuctsForStoreHomeData(storeHomeDataCategories.localFoods, userCommunityPostcodesIds));
    productPromises.push(this._getProuctsForStoreHomeData(storeHomeDataCategories.localHelps, userCommunityPostcodesIds));
    productPromises.push(this._getProuctsForStoreHomeData(storeHomeDataCategories.childrenActivities, userCommunityPostcodesIds));

    let [localBusiness, localFood, localHelp, childrenActivities] = await Promise.all(productPromises)

    if (localBusiness.length === 0 ){
      localBusiness = await this._getOrganisationsForStoreHomeData(storeHomeDataCategories.localBusiness, flattenPostcodes);
    }
    if (localFood.length === 0 ){
      localFood = await this._getProuctsForStoreHomeData(storeHomeDataCategories.localFoods, flattenPostcodes);
    }
    if (localHelp.length === 0 ){
      localHelp = await this._getProuctsForStoreHomeData(storeHomeDataCategories.localHelps, flattenPostcodes);
    }
    if (childrenActivities.length === 0 ){
      childrenActivities = await this._getProuctsForStoreHomeData(storeHomeDataCategories.childrenActivities, flattenPostcodes);
    }

    return {
      localBusiness,
      localFood: localFood,
      localHelp: localHelp,
      childrenActivities: childrenActivities,
    };
  }

  async getStoreHomeCategories(){
    let categoriesPromises = [];
    categoriesPromises.push(this.categoryService.getCategoriesByParams({where: {name: In(storeHomeDataCategories.localBusiness)}}));
    categoriesPromises.push(this.categoryService.getCategoriesByParams({where: {name: In(storeHomeDataCategories.localFoods)}}));
    categoriesPromises.push(this.categoryService.getCategoriesByParams({where: {name: In(storeHomeDataCategories.localHelps)}}));
    categoriesPromises.push(this.categoryService.getCategoriesByParams({where: {name: In(storeHomeDataCategories.childrenActivities)}}));

    let [localBusiness, localFood, localHelp, childrenActivities] = await Promise.all(categoriesPromises)


    const result = [
      {
        title: "Local business",
        categories: localBusiness
      },
      {
        title: "Local foods - Pick up and delivery",
        categories: localFood
      },
      {
        title: "Local help",
        categories: localHelp
      },
      {
        title: "Children activities",
        categories: childrenActivities
      }
    ]
    
    return result;

  }

  async getUserDeliviries(user: User){
    try{
      return this.deliveryRepository.find({where:{user_id: user.id, reuse: true}})
    } catch (err) {
      this.logger.error(err);
      HttpErrorHelper.checkDataBaseError(err);
      throw err;
    }
  }
}
