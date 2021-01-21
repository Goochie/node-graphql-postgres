import { Resolver, Args, Mutation, Context, Query } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { Int, ObjectType } from 'type-graphql';
import { UseGuards, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { MessageDto } from './dto/message.dto';
import { MessageInputDto } from './dto/message-input.dto';
import { FromContextPipe } from '../common/from-context.pipe';
import { User } from '../user/user.entity';
import { HTTP_ERROR_MESSAGE_NOT_FOUND } from '../common/helpers/http-error-helper';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { FileService } from '../common/services/file/file.service';
import { FriendOut } from '../user/dto/friend.out';

@Resolver('Message')
export class MessageResolver {

  constructor(private readonly messageSrv: MessageService, private readonly fileSrv: FileService) {

  }

  @Query(() => [MessageDto])
  @UseGuards(JwtGuard)
  async getMessagesFor(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    return this.messageSrv.getMessagesFor(user.id, id);
  }

  @Query(() => [FriendOut])
  @UseGuards(JwtGuard)
  async getMyChats(
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    return this.messageSrv.getMyChats(user.id);
  }

  @Mutation(() => MessageDto)
  @UseGuards(JwtGuard)
  async createMessage(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => GraphQLUpload, name: 'upload', nullable: true}) file: FileUpload,
    @Args('input') input: MessageInputDto,
  ) {
    let s3file: ManagedUpload.SendData;
    if (file) {
      s3file = await this.fileSrv.fileUpload(file, `update/${Date.now()}/`);
      input.attachUrl = s3file.Location;
    }
    return this.messageSrv.create(input, user);
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async markAllMessage(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    await this.messageSrv.markAll(user.id, id);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async deleteMessage(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => String, name: 'id'}) id: string,
  ) {
    const message = (await this.messageSrv.find({id}, ['from']))[0];
    if (!message) {
      throw new NotFoundException(HTTP_ERROR_MESSAGE_NOT_FOUND);
    }
    if (message.from.id !== user.id) {
      throw new ForbiddenException();
    }
    await this.messageSrv.delete(id);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async editMessage(
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({type: () => String, name: 'id'}) id: string,
      @Args({type: () => String, name: 'text'}) text: string,
  ) {
    await this.messageSrv.edit(id, text);
    return 'OK';
  }
}
