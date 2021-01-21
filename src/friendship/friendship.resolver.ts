import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { FriendshipService } from './friendship.service';
import { UseGuards, Req } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { Friendship } from './friendship.entity';
import { FromContextPipe } from '../common/from-context.pipe';
import { AuthService } from '../common/services/auth/auth.service';
import { User } from '../user/user.entity';
import { Int } from 'type-graphql';
import { UserOut } from '../user/dto/user.out';
import { FriendOut } from '../user/dto/friend.out';

@Resolver('Friendship')
export class FriendshipResolver {
    constructor(private readonly friendshipService: FriendshipService, private readonly authSrv: AuthService) {}

    @Mutation(() => String)
    @UseGuards(JwtGuard)
    async addToFriend(
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({name: 'friendId', type: () => Int }) id: number,
      @Args({name: 'url', type: () => String, nullable: true }) url: string,
      @Args({name: 'message', type: () => String, nullable: true }) message: string,
    ) {
      await this.friendshipService.requestFriendship(user.id, id, message, url);
      return 'OK';
    }

    @Mutation(() => String)
    @UseGuards(JwtGuard)
    async addToFriendBatch(
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({name: 'friendIds', type: () => [Int] }) ids: number[],
      @Args({name: 'url', type: () => String, nullable: true }) url: string,
      @Args({name: 'message', type: () => String, nullable: true }) message: string,
    ) {
      for (const id of ids) {
        await this.friendshipService.requestFriendship(user.id, id, message, url);
      }
      return 'OK';
    }

    @Mutation(() => String)
    @UseGuards(JwtGuard)
    async deleteFromFriend(
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({name: 'friendId', type: () => Int }) id: number,
    ) {
      await this.friendshipService.removeFriendship(user, id);
      return 'OK';
    }

    @Query(() => [FriendOut])
    @UseGuards(JwtGuard)
    async getMyFriends(
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({name: 'approved', type: () => Boolean, nullable: true}) approved: boolean = false,
    ) {
        return this.friendshipService.findAll(user.id, approved);
    }
}
