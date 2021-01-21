import { Resolver, Query, Context, Mutation, Args } from '@nestjs/graphql';
import { ThemeImagesOut } from './dto/theme-images.dto';
import { User } from '../user/user.entity';
import { FromContextPipe } from '../common/from-context.pipe';
import { UseGuards } from '@nestjs/common';
import { ThemeImagesService } from './theme-images.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@Resolver('ThemeImages')
export class ThemeImagesResolver {
  constructor(private readonly themeImageSrv: ThemeImagesService) {

  }

  @Query(() => [ThemeImagesOut])
  @UseGuards(JwtGuard)
  getImages(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Boolean, name: 'isSquare', nullable: true}) isSquare: boolean,
  ) {
    return this.themeImageSrv.getImages(isSquare);
  }

  @Query(() => [ThemeImagesOut])
  @UseGuards(JwtGuard)
  getMyImages(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Boolean, name: 'isSquare', nullable: true}) isSquare: boolean,
  ) {
    return this.themeImageSrv.getMyImages(user.id, isSquare);
  }

  @Mutation(() => ThemeImagesOut)
  @UseGuards(JwtGuard)
  async createMyImage(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => GraphQLUpload, name: 'file', nullable: true}) file: FileUpload,
  ) {
    return this.themeImageSrv.createImage(user.id, file);
  }
}
