import { Resolver, Args, Mutation, Context, Query } from '@nestjs/graphql';
import { UpdateService } from './updates.service';
import { Arg, Int } from 'type-graphql';
import { UseGuards, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { UpdateDto } from './dto/updates.dto';
import { UpdateInputDto } from './dto/updates-input.dto';
import { FromContextPipe } from '../common/from-context.pipe';
import { User } from '../user/user.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FileService } from '../common/services/file/file.service';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { OptionalJwtGuard } from '../common/guards/jwt-optyonal.guard';
import { HTTP_ERROR_UPDATE_NOT_FOUND } from '../common/helpers/http-error-helper';
import { UpdateParamsInputDto } from './dto/updates-params-input';

@Resolver('Update')
export class UpdateResolver {

  constructor(private readonly updateSrv: UpdateService, private readonly fileSrv: FileService) {

  }

  @Query(() => [UpdateDto])
  @UseGuards(OptionalJwtGuard)
  async getUpdatesFor(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => UpdateParamsInputDto, name: 'params'}) params: UpdateParamsInputDto,
  ) {
    return this.updateSrv.getUpdatesFor(params);
  }

  @Query(() => [UpdateDto])
  @UseGuards(OptionalJwtGuard)
  async getChildUpdates(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => String, name: 'id'}) id: string,
  ) {
    return this.updateSrv.getChildUpdates(id);
  }

  @Mutation(() => UpdateDto)
  @UseGuards(JwtGuard)
  async createUpdate(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => GraphQLUpload, name: 'upload', nullable: true}) file: FileUpload,
    @Args('input') input: UpdateInputDto,
  ) {
    let s3file: ManagedUpload.SendData;
    if (file) {
      s3file = await this.fileSrv.fileUpload(file, `update/${Date.now()}/`);
      input.attachUrl = s3file.Location;
    }
    return this.updateSrv.create(input, user);
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async deleteUpdate(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: string,
  ) {
    const update = (await this.updateSrv.find({id}))[0];
    if (!update) {
      throw new NotFoundException(HTTP_ERROR_UPDATE_NOT_FOUND);
    }
    if (update.user.id !== user.id) {
      throw new ForbiddenException();
    }
    await this.updateSrv.delete(id);
    return 'OK';
  }
}
