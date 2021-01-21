import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserInput } from './dto/user.input';
import { UserOut, MeOut } from './dto/user.out';
import { LoginResponce } from './dto/login-rsp';
import { UseGuards, Req, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { User } from './user.entity';
import { FromContextPipe } from '../common/from-context.pipe';
import { AuthService } from '../common/services/auth/auth.service';
import { UserUpdate } from './dto/user.updatet';
import * as _ from 'lodash';
import { YahooService } from '../common/services/yahoo/yahoo.service';
import { SocialUser } from '../common/services/yahoo/social.user';
import { GoogleService } from '../common/services/google/google.service';
import { OauthUrlOut } from './dto/oauth.url.out';
import { MSMailService } from '../common/services/msmail/msmail.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { FileService } from '../common/services/file/file.service';
import { UserSavingInput } from './dto/saving';
import { HouseSavingStatus } from './dto/house-saving-status';
import { HTTP_ERROR_PROFILE_NOT_FOUND } from '../common/helpers/http-error-helper';
import { PublicProfile } from './dto/publicProfile';
import { Int } from 'type-graphql';
import { SourceOut } from './dto/source';
import { CardData } from './dto/card.input';
import { StripeService } from '../common/services/stripe/stripe.service';
import { TransactionOut } from '../common/dto/transaction.out';
import { EmailService } from '../common/services/email/email.service';

const userTodo = [
  'SELECT-FUND',
  'FIND-ORGANISATIONS',
  'FIND-EVENTS',
  'CONNECT-WITH-COMMUNITIES',
  'INVITE-FRIENDS',
];

const orgTodo = [
  'CREATE-EVENT',
  'CREATE-PROFILE',
  'UPDATE',
  'INVITE-PEOPLE',
];

@Resolver('User')
export class UserResolver {
    constructor(
      private readonly userService: UserService,
      private readonly authSrv: AuthService,
      private readonly yahoo: YahooService,
      private readonly google: GoogleService,
      private readonly msmail: MSMailService,
      private readonly stripe: StripeService,
      private readonly fileSrv: FileService,
      private readonly email: EmailService,
    ) {}

    @Query(() => String)
    async hello() {
        this.userService.accumulatedEmail();
        return await 'Whatever';
    }

    @Query(() => MeOut)
    @UseGuards(JwtGuard)
    async me(@Context(new FromContextPipe('req.user')) user: User) {
      var newUser: MeOut = user;
      newUser.followersCnt = user.followers.length;
      newUser.followingCnt = user.following.length;
      return newUser;
    }

    @Query(() => [SourceOut])
    @UseGuards(JwtGuard)
    async getPaySourceList(@Context(new FromContextPipe('req.user')) user: User) {
      return this.userService.getPaySourceList(user);
    }

    @Mutation(() => String)
    @UseGuards(JwtGuard)
    async deletePaySource(
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({name: 'id', type: () => String}) id: string,
    ) {
      this.userService.deleteSource(user, id);
      return 'Ok';
    }

    @Mutation(() => String)
    @UseGuards(JwtGuard)
    async createSource(
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({name: 'card', type: () => CardData}) card: CardData,
    ) {
      return this.userService.createSourceList(user, card);
    }

    @Query(() => OauthUrlOut)
    async getOauthUrl(
      @Args('url') url: string,
    ) {
      return {
        yahoo: this.yahoo.getAuthLink(url + '/oauth.html'),
        google: this.google.getAuthLink(url + '/oauth.html'),
        outlook: this.msmail.getAuthLink(url + '/oauth.html'),
        stripe: this.stripe.getAuthLink(url + '/stripe.html'),
      };
    }

    @Mutation(() => String)
    @UseGuards(JwtGuard)
    async connectStripe(
      @Args('code') code: string,
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({ type: () => String, nullable: true, name: 'redirect_uri'}) redirect_uri: string,
    ) {
      const data = await this.userService.connectStripe(code, user);
      return 'OK';
    }

    @Mutation(() => String)
    @UseGuards(JwtGuard)
    async deauthorizeConnect(
      @Context(new FromContextPipe('req.user')) user: User,
    ) {
      const data = await this.userService.deauthorizeConnect(user);
      return 'OK';
    }

    @Query(() => Boolean)
    @UseGuards(JwtGuard)
    async testStripe(
      @Context(new FromContextPipe('req.user')) user: User,
    ) {
      return this.userService.testStripe(user);
    }

    @Query(() => [SocialUser])
    async getContacts(
      @Args('code') code: string,
      @Args({ type: () => String, nullable: true, name: 'type'}) type: string,
      @Args({ type: () => String, nullable: true, name: 'redirect_uri'}) redirect_uri: string,
    ) {
      if (type === 'google') {
        return this.google.getContacts(code, redirect_uri);
      }
      if (type === 'outlook') {
        return this.msmail.getContacts(code, redirect_uri);
      }
      return this.yahoo.getContacts(code);
    }

    @Query(() => [TransactionOut])
    @UseGuards(JwtGuard)
    async getMyTransaction(
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({type: () => String, name: 'sort', nullable: true}) sort: string,
    ) {
      const sortMap = {
        'type': {type: 'ASC'},
        '-type': {type: 'DESC'},
        'amount': {amount: 'ASC'},
        '-amount': {amount: 'DESC'},
        'fund': {fund: {title: 'ASC'}},
        '-fund': {fund: {title: 'DESC'}},
        'date': {updatedDate: 'ASC'},
        '-date': {updatedDate: 'DESC'},
      };

      let sortObj = {
        updatedDate: 'DESC',
      };

      if (sortMap[sort]) {
        sortObj = sortMap[sort];
      }
      return this.stripe.getMyTransaction(user, sortObj);
    }

    @Query(() => UserOut, {nullable: true})
    @UseGuards(JwtGuard)
    async getUser(
      @Context(new FromContextPipe('req.user')) user: User,
      @Args('filter') filter: string = '',
    ) {
        return this.userService.findByEmail(filter.toLocaleLowerCase().trim());
    }

    @Mutation(() => String)
    async resetPassword(@Args('email') email: string, @Args('url') url: string) {
      await this.userService.resetPassword(email, url);
      return 'OK';
    }

    @Mutation(() => String)
    async updatePassword(@Args('token') token: string, @Args('password') password: string) {
      await this.userService.updatePassword(token, password);
      return 'OK';
    }

    @Mutation(() => String)
    @UseGuards(JwtGuard)
    async requestToVerifyEmail(
      @Context(new FromContextPipe('req.user')) user: User,
      @Args('url') url: string) {
      await this.userService.requestToVerifyEmail(user, url);
      return 'OK';
    }

    @Mutation(() => String)
    async verifyEmail(@Args('token') token: string) {
      await this.userService.verifyEmail(token);
      return 'OK';
    }

    @Mutation(() => LoginResponce)
    async createUser(@Args('input') input: UserInput) {
        return await this.userService.create(input);
    }

    @Mutation(() => String)
    @UseGuards(JwtGuard)
    async updateUser(
      @Args('input') input: UserUpdate,
      @Args({type: () => GraphQLUpload, name: 'file', nullable: true}) file: FileUpload,
      @Args('url') url: string,
      @Context(new FromContextPipe('req.user')) user: User,
    ) {
      let s3file: ManagedUpload.SendData;
      if (file) {
        s3file = await this.fileSrv.fileUpload(file, `user/${user.id}/`, {resize: 'avatar'});
        input.photoUrl = s3file.Location;
      }
      await this.userService.update(user.id, input, url);
      return 'OK';
    }

    @Mutation(() => LoginResponce)
    async login(@Args('email') email: string, @Args('password') password: string) {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new BadRequestException('email is incorrect');
      } else if (!await this.authSrv.comparePassword(password, user.passwordHash)) {
        throw new BadRequestException('password is incorrect');
      }
      let isUpdate = false;
      if (_.intersection(user.compliteTodo, userTodo).length >= userTodo.length) {
        user.todo = true;
        isUpdate = true;
      }
      if (_.intersection(user.compliteTodo, orgTodo).length >= orgTodo.length) {
        user.orgTodo = true;
        isUpdate = true;
      }
      if (isUpdate) {
        await this.userService.userRepository.save(user);
      }

      return {
        token: this.authSrv.createToken(user.email, user.id),
        user,
      };
    }

    @Mutation(() => String)
    @UseGuards(JwtGuard)
    async updateUserSaving(
      @Args('input') input: UserSavingInput,
      @Context(new FromContextPipe('req.user')) user: User,
    ) {
      await this.userService.updateUserSaving(user, input);
      return 'OK';
    }

    @Query(() => PublicProfile)
    @UseGuards(JwtGuard)
    async getProfile(
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({type: () => Int, name: 'id'}) id: number,
    ) {
      return this.userService.getProfile(id, user);
    }

    @Mutation(() => String)
    @UseGuards(JwtGuard)
    async followProfile(
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({type: () => Int, name: 'id'}) id: number,
    ) {
      const profile = (await this.userService.findById(id));
      if (!profile) {
        throw new NotFoundException(HTTP_ERROR_PROFILE_NOT_FOUND);
      }
      if (profile.id === user.id) {
        throw new BadRequestException(HTTP_ERROR_PROFILE_NOT_FOUND);
      }
      await this.userService.follow(id, user);
      return 'OK';
    }

    @Mutation(() => String)
    @UseGuards(JwtGuard)
    async unfollowProfile(
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({type: () => Int, name: 'id'}) id: number,
    ) {
      const profile = (await this.userService.findById(id));
      if (!profile) {
        throw new NotFoundException(HTTP_ERROR_PROFILE_NOT_FOUND);
      }
      if (profile.id === user.id) {
        throw new BadRequestException(HTTP_ERROR_PROFILE_NOT_FOUND);
      }
      await this.userService.unfollow(id, user);
      return 'OK';
    }

    @Query(() => HouseSavingStatus)
    @UseGuards(JwtGuard)
    async getHouseStatus(

      ): Promise<HouseSavingStatus> {
        return {
          energy: new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.ceil(Math.random() * 200)),
          mobile: new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.ceil(Math.random() * 200)),
          insurance: null,
          phoneInternet: new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.ceil(Math.random() * 200)),
        };
      }
}
