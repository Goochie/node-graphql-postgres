import { Resolver, Args, Query } from '@nestjs/graphql';
import { CommunityService } from './community.service';
import { JwtGuard } from '../guards/jwt.guard';
import { UseGuards, NotFoundException } from '@nestjs/common';
import { Community } from './community.entity';
import { CommunityDto } from './dto/communitys.dto';

@Resolver('Community')
export class CommunityResolver {

  constructor(private readonly communitySrv: CommunityService) {

  }

  @Query(() => CommunityDto)
  async getCommunityById(
    @Args({type: () => String, name: 'id'}) id: string,
  ) {
    const comm = this.communitySrv.getCommunityById(id);
    if (!comm) {
      throw new NotFoundException('Community not found');
    }
    return comm;
  }
}
