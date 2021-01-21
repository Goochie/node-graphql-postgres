import { UseGuards, BadRequestException } from '@nestjs/common';
import { Resolver, Query, Context, Args, Mutation } from '@nestjs/graphql';
import { FromContextPipe } from '../common/from-context.pipe';
import { JwtGuard } from '../common/guards/jwt.guard';
import { HTTP_ERROR_YOU_NOT_CONFIGURED, HTTP_ERROR_YOU_NOT_REQUIRED, HTTP_ERROR_YOU_NOT_VOLUNTEER } from '../common/helpers/http-error-helper';
import { User } from '../user/user.entity';
import { RequestDto } from './dto/request.dto';
import { RequestGateway } from './request.gateway';
import { RequestService } from './request.service';
import { Int } from 'type-graphql';
import { UserOut } from '../user/dto/user.out';

@Resolver('Request')
export class RequestResolver {

  constructor(
    private readonly requestSrv: RequestService,
    private readonly requestGateway: RequestGateway,
  ) {
  }
  
  @Query(() => [RequestDto])
  @UseGuards(JwtGuard)
  async initRequests(
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    if(user.supportType != 'required' && user.supportType != 'volunteer') {
      throw new BadRequestException(HTTP_ERROR_YOU_NOT_CONFIGURED);
    }
    const community = user.postcode?.communityId;
    return await this.requestSrv.findRequests(community);
  }

  filterUser(user: UserOut) {
    return new UserOut({
      id: user.id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      photoUrl: user.photoUrl,
      supportType: user.supportType,
      location: user.location,
    });
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async sendRequest(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => String, name: 'description'}) description: string,
  ) {
    if(user.supportType != 'required') {
      throw new BadRequestException(HTTP_ERROR_YOU_NOT_REQUIRED);
    }
    const community = user.postcode?.communityId;
    const req = new RequestDto({
      ...await this.requestSrv.createRequest(description, community, user)
    });
    if(req.owner) {
      req.owner = this.filterUser(req.owner);
    }
    if(req.volunteer) {
      req.volunteer = this.filterUser(req.volunteer);
    }
    this.requestGateway.server.emit('created', { req, community });
    return 'OK';
  }
  
  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async deleteRequest(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    if(user.supportType != 'required') {
      throw new BadRequestException(HTTP_ERROR_YOU_NOT_VOLUNTEER);
    }
    const community = user.postcode?.communityId;
    const req = await this.requestSrv.deleteRequest(id, community, user);
    this.requestGateway.server.emit('deleted', { id, community });
    return 'OK';
  }
  
  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async acceptRequest(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    if(user.supportType != 'volunteer') {
      throw new BadRequestException(HTTP_ERROR_YOU_NOT_VOLUNTEER);
    }
    const community = user.postcode?.communityId;
    const req = new RequestDto({
      ...await this.requestSrv.acceptRequest(id, community, user)
    });
    if(req.owner) {
      req.owner = this.filterUser(req.owner);
    }
    if(req.volunteer) {
      req.volunteer = this.filterUser(req.volunteer);
    }
    this.requestGateway.server.emit('accepted', { req, community });
    return 'OK';
  }
  
  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async cancelRequest(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    if(user.supportType != 'volunteer') {
      throw new BadRequestException(HTTP_ERROR_YOU_NOT_VOLUNTEER);
    }
    const community = user.postcode?.communityId;
    const req = new RequestDto({
      ...await this.requestSrv.cancelRequest(id, community, user)
    });
    if(req.owner) {
      req.owner = this.filterUser(req.owner);
    }
    if(req.volunteer) {
      req.volunteer = this.filterUser(req.volunteer);
    }
    this.requestGateway.server.emit('cancelled', { req, community });
    return 'OK';
  }
  
  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async fulfillRequest(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    if(user.supportType != 'volunteer') {
      throw new BadRequestException(HTTP_ERROR_YOU_NOT_VOLUNTEER);
    }
    const community = user.postcode?.communityId;
    const req = new RequestDto({
      ...await this.requestSrv.fulfillRequest(id, community, user)
    });
    if(req.owner) {
      req.owner = this.filterUser(req.owner);
    }
    if(req.volunteer) {
      req.volunteer = this.filterUser(req.volunteer);
    }
    this.requestGateway.server.emit('fulfilled', { req, community });
    return 'OK';
  }

}
