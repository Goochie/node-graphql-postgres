import { Resolver, Args, Mutation, Context, Query } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Int } from 'type-graphql';
import { UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { NotificationDto } from './dto/notification.dto';
import { FromContextPipe } from '../common/from-context.pipe';
import { User } from '../user/user.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FileService } from '../common/services/file/file.service';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { OptionalJwtGuard } from '../common/guards/jwt-optyonal.guard';
import { InviteInput } from './dto/invite.input';
import { InviteAllInput } from './dto/invite-all.input';

@Resolver('Notification')
export class NotificationResolver {

  constructor(private readonly notificationSrv: NotificationService, private readonly fileSrv: FileService) {

  }

  @Query(() => [NotificationDto])
  @UseGuards(JwtGuard)
  async getNotifications(
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    return this.notificationSrv.getNotificationsFor(user);
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async notificationMarkRead(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => String, name: 'id'}) id: string,
    @Args({type: () => String, name: 'action', nullable: true}) action?: string,
  ) {
    await this.notificationSrv.markRead(id, action);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async allNotificationMarkRead(
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    await this.notificationSrv.markAllRead(user.id);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async inviteTo(
    @Args({type: () => InviteInput, name: 'input'}) input: InviteInput,
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    await this.notificationSrv.inviteTo(input.entity, input.entity_id, input.title, input.users, user);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async inviteToByEmail(
    @Args({type: () => InviteInput, name: 'input'}) input: InviteInput,
    @Args({type: () => String, name: 'url'}) url: string,
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    await this.notificationSrv.inviteToByEmail(input.entity, input.entity_id, input.title, input.users, user, url);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async inviteAllFollowers(
    @Args({type: () => InviteAllInput, name: 'input'}) input: InviteAllInput,
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    await this.notificationSrv.inviteAllFollowers(input.entity, input.entity_id, input.title, input.sender_type, input.sender_id, user);
    return 'OK';
  }
}
