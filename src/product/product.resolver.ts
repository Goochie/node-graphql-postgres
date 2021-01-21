import { Resolver, Args, Mutation, Context, Query } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Arg, Int, Float } from 'type-graphql';
import { UseGuards, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { ProductOut, ProductSearchResult } from './dto/product.dto';
import { ProductInputDto } from './dto/product-input.dto';
import { FromContextPipe } from '../common/from-context.pipe';
import { User } from '../user/user.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FileService } from '../common/services/file/file.service';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { OptionalJwtGuard } from '../common/guards/jwt-optyonal.guard';
import { HTTP_ERROR_PRODUCT_NOT_FOUND } from '../common/helpers/http-error-helper';
import { UserOut } from '../user/dto/user.out';
import { ProductUpdateDto } from './dto/product-update.dto';
import { In, MoreThanOrEqual } from 'typeorm';
import { DeliverySettingsOut } from './dto/delivery-setings.dto';
import { DeliverySettingsInput } from './dto/delivery-setings.input';
import { ProductFilter } from './dto/productFilter';
import { CategoryOut } from '../categories/dto/category.dto';
import { SearchCategoryTag } from './dto/search-category-tag.dto';
import { ProductSearchDto } from './dto/product-search.dto';
import { Product } from './product.entity';
import { PreselectedCategory, PreselectedCategoryTypes } from './dto/preselected-category.dto';

@Resolver('Product')
export class ProductResolver {

  constructor(private readonly productSrv: ProductService, private readonly fileSrv: FileService, private readonly  logger: Logger) {

  }

  @Query(() => ProductOut)
  @UseGuards(OptionalJwtGuard)
  async getProduct(
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({type: () => String, name: 'id'}) id: string
    ) {
    const product = (await this.productSrv.find({id}))[0];
    if (!product) {
      throw new NotFoundException(HTTP_ERROR_PRODUCT_NOT_FOUND);
    }
    return product;
  }

  @Query(() => [ProductOut])
  @UseGuards(OptionalJwtGuard)
  async getProductFor(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
    @Args({type: () => String, name: 'entity'}) entity: string,
    @Args({type: () => ProductFilter, name: 'filter'}) filter: ProductFilter,
    @Args({type: () => String, name: 'searchTxt'}) searchTxt: string,
  ) {

    const products = (await this.productSrv.findFor(user, id, entity, filter, searchTxt));
    return products;
  }

  @Query(() => [ProductOut])
  @UseGuards(OptionalJwtGuard)
  async topListings(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
    @Args({type: () => String, name: 'itemType'}) itemType: string
  ) {
    const products = (await this.productSrv.topListings(id, itemType));
    return products;
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async batchUpdateProduct(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => [String], name: 'ids'}) ids: string[],
    @Args({type: () => String, name: 'action'}) action: 'delete' | 'deactivate' | 'renew',
  ) {

    await this.productSrv.batch(ids, action);
    return 'OK';
  }

  @Mutation(() => ProductOut)
  @UseGuards(JwtGuard)
  async cloneProduct(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => String, name: 'id'}) id: string,
  ) {

    const products = (await this.productSrv.clone(id));
    return products;
  }

  @Mutation(() => ProductOut)
  @UseGuards(JwtGuard)
  async createProduct(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args('input') input: ProductInputDto,
    @Args({name: 'delivery', type: () => DeliverySettingsInput, nullable: true}) delivery: DeliverySettingsInput,
  ) {
    return this.productSrv.create(input, delivery, user);
  }

  @Mutation(() => ProductOut)
  @UseGuards(JwtGuard)
  async updateProduct(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args('input') input: ProductUpdateDto,
    @Args({name: 'delivery', type: () => DeliverySettingsInput, nullable: true}) delivery: DeliverySettingsInput,
  ) {
    return this.productSrv.update(input);
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async tmpUpload(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => GraphQLUpload, name: 'upload', nullable: true}) file: FileUpload,
  ) {
    const s3file = await this.fileSrv.fileUpload(file, `tmp/`);
    return s3file.Location;
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async deleteProduct(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => String, name: 'id'}) id: string,
  ) {
    const product = (await this.productSrv.find({id}))[0];
    if (!product) {
      throw new NotFoundException(HTTP_ERROR_PRODUCT_NOT_FOUND);
    }
    await this.productSrv.delete(id);
    return 'OK';
  }

  @Query(() => [SearchCategoryTag])
  @UseGuards(OptionalJwtGuard)
  async getProductsCategoriesAndTags() {
    const result = await this.productSrv.getProductsCategoriesAndTags();

    return result;
  }

  @Query(() => ProductSearchResult)
  @UseGuards(OptionalJwtGuard)
  async searchStore(
    @Args('input') input: ProductSearchDto,
  ) {
    const result = await this.productSrv.searchStore(input);
    
    return result;
  }

  @Query(() => PreselectedCategory)
  @UseGuards(OptionalJwtGuard)
  async getStoreHomeData(
    @Context(new FromContextPipe('req.user')) user: User,
  ){
    const result = await this.productSrv.getStoreHomeData(user);

    return result;
  }

  @Query(() => [PreselectedCategoryTypes])
  @UseGuards(OptionalJwtGuard)
  async getStoreHomeCategories(){
    const result = await this.productSrv.getStoreHomeCategories()

    return result;
  }

  @Query(() => [DeliverySettingsOut])
  @UseGuards(OptionalJwtGuard)
  async getUserDeliviries(
    @Context(new FromContextPipe('req.user')) user: User,
  ){
    return await this.productSrv.getUserDeliviries(user);
  }
}
