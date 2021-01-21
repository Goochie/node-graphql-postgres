import { Resolver, Args, Mutation, Context, Query } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { Int } from 'type-graphql';
import { UseGuards, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { ReviewDto } from './dto/review.dto';
import { ReviewInputDto } from './dto/review-input.dto';
import { FromContextPipe } from '../common/from-context.pipe';
import { User } from '../user/user.entity';
import { OptionalJwtGuard } from '../common/guards/jwt-optyonal.guard';
import { HTTP_ERROR_UPDATE_NOT_FOUND } from '../common/helpers/http-error-helper';
import { ReviewParamsInputDto } from './dto/review-params-input';

@Resolver('Review')
export class ReviewResolver {

  constructor(private readonly reviewSrv: ReviewService) {

  }

  @Query(() => [ReviewDto])
  @UseGuards(OptionalJwtGuard)
  async getReviewsFor(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => ReviewParamsInputDto, name: 'params'}) params: ReviewParamsInputDto,
  ) {
    return this.reviewSrv.getReviewsFor(params);
  }

  @Query(() => [ReviewDto])
  @UseGuards(OptionalJwtGuard)
  async getChildReviews(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => String, name: 'id'}) id: string,
  ) {
    return this.reviewSrv.getChildReviews(id);
  }

  @Mutation(() => ReviewDto)
  @UseGuards(JwtGuard)
  async createReview(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args('input') input: ReviewInputDto,
  ) {
    return this.reviewSrv.create(input, user);
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async deleteReview(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: string,
  ) {
    const review = (await this.reviewSrv.find({id}))[0];
    if (!review) {
      throw new NotFoundException(HTTP_ERROR_UPDATE_NOT_FOUND);
    }
    if (review.user.id !== user.id) {
      throw new ForbiddenException();
    }
    await this.reviewSrv.delete(id);
    return 'OK';
  }
}
