import { Resolver, Args, Mutation, Context, Query } from '@nestjs/graphql';
import { OrganisationService } from './organisation.service';
import { Arg, Int, Float } from 'type-graphql';
import { UseGuards, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtGuard } from '../common/guards/jwt.guard';
import { OrganisationDto } from './dto/organisation.dto';
import { OrganisationInputDto } from './dto/organisation-input.dto';
import { FromContextPipe } from '../common/from-context.pipe';
import { User } from '../user/user.entity';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FileService } from '../common/services/file/file.service';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { OptionalJwtGuard } from '../common/guards/jwt-optyonal.guard';
import { HTTP_ERROR_YOU_OWNER_ORG, HTTP_ERROR_YOU_NOT_OWNER_ORG } from '../common/helpers/http-error-helper';
import { HTTP_ERROR_ORG_NOT_FOUND } from '../common/helpers/http-error-helper';
import { OrganisationUpdateInputDto } from './dto/organisation-udate-input.dto';
import { TariffOut } from './dto/tarif';
import { PartnerStats } from './dto/partner.status';
import { Organisation } from './organisation.entity';
import { UserOut } from '../user/dto/user.out';
import { RelatedUser } from '../common/dto/related-user';

@Resolver('Organisation')
export class OrganisationResolver {

  constructor(private readonly organisationSrv: OrganisationService, private readonly fileSrv: FileService) {

  }

  @Query(() => OrganisationDto)
  @UseGuards(OptionalJwtGuard)
  async getOrganisation(@Context(new FromContextPipe('req.user')) user: User, @Args({type: () => Int, name: 'id'}) id: number) {
    const organisation = (await this.organisationSrv.find({id}, {isIFollow: (user) ? user.id : null}))[0];
    if (!organisation) {
      throw new NotFoundException(HTTP_ERROR_ORG_NOT_FOUND);
    }
    return organisation;
  }

  @Query(() => [OrganisationDto])
  @UseGuards(OptionalJwtGuard)
  async getOrganisationForCommunity(@Context(new FromContextPipe('req.user')) user: User, @Args({type: () => String, name: 'id'}) id: string) {
    const orgs = (await this.organisationSrv.getOrganisationForCommunity(id, {isIFollow: (user) ? user.id : null}));
    return orgs;
  }

  @Query(() => [OrganisationDto])
  @UseGuards(OptionalJwtGuard)
  async searchOrg(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => [Float, Float], name: 'coordinates', nullable: true}) coordinates: [number, number],
    @Args({type: () => Float, name: 'radius', nullable: true}) radius: number,
    @Args({type: () => [Int], name: 'categories', nullable: true}) categories: number[],
  ) {
    return this.organisationSrv.search(coordinates, radius, categories, {isIFollow: (user) ? user.id : null});
  }

  @Query(() => [OrganisationDto])
  @UseGuards(JwtGuard)
  async getMyOrganisations(@Context(new FromContextPipe('req.user')) user: User) {
    const organisations = (await this.organisationSrv.find([{owner: {id: user.id}}, {organisation_followers: user.id}], {isIFollow: user.id}));

    return organisations;
  }

  @Query(() => PartnerStats)
  @UseGuards(JwtGuard)
  async getPartnerStatistic(
    @Args({type: () => Int, name: 'org_id', nullable: true}) org_id: number,
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    return this.organisationSrv.getFunds(org_id, user);
  }

  @Query(() => [OrganisationDto])
  @UseGuards(JwtGuard)
  async getPartners(
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    const organisations = (await this.organisationSrv.find({partner: true}, {isIFollow: user.id}));

    return organisations;
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async openContract(
    @Args({type: () => String, name: 'productId', nullable: true}) productId: string,
    @Args({type: () => Int, name: 'toFondId', nullable: true}) toFondId: number,
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    await this.organisationSrv.openContract(productId, toFondId, user.id);
    return 'OK';
  }

  @Query(() => [TariffOut])
  async getTarifs() {
    return this.organisationSrv.getTarifs();
  }

  @Query(() => [UserOut])
  @UseGuards(JwtGuard)
  async getOrgMembers(
    @Args({type: () => Int, name: 'id'}) id: number,
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    const org = (await this.organisationSrv.find({id}))[0];
    if (!org) {
      throw new NotFoundException(HTTP_ERROR_ORG_NOT_FOUND);
    }
    if (org.owner.id !== user.id) {
      throw new BadRequestException(HTTP_ERROR_YOU_NOT_OWNER_ORG);
    }

    const members = await this.organisationSrv.getOrgMembers(id);

    return members;
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async removeOrgMember(
    @Args({type: () => Int, name: 'orgId'}) orgId: number,
    @Args({type: () => Int, name: 'userId', nullable: true}) userId: number,
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    const organisation = (await this.organisationSrv.find({id: orgId}))[0];
    if (!organisation) {
      throw new NotFoundException(HTTP_ERROR_ORG_NOT_FOUND);
    }
    if (organisation.owner.id !== user.id) {
      throw new BadRequestException(HTTP_ERROR_YOU_NOT_OWNER_ORG);
    }

    await this.organisationSrv.removeOrgMember(orgId, userId);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async inviteOrgMembers(
    @Args({type: () => [RelatedUser], name: 'users'}) users: RelatedUser[],
    @Args({type: () => Int, name: 'orgId'}) orgId: number,
    @Context(new FromContextPipe('req.user')) user: User,
  ) {
    const organisation = (await this.organisationSrv.find({id: orgId}))[0];
    if (!organisation) {
      throw new NotFoundException(HTTP_ERROR_ORG_NOT_FOUND);
    }
    if (organisation.owner.id !== user.id) {
      throw new BadRequestException(HTTP_ERROR_YOU_NOT_OWNER_ORG);
    }

    await this.organisationSrv.inviteOrgMembers(user, organisation, users);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async followOrganisation(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const organisation = (await this.organisationSrv.find({id}))[0];
    if (!organisation) {
      throw new NotFoundException(HTTP_ERROR_ORG_NOT_FOUND);
    }
    if (organisation.owner.id === user.id) {
      throw new BadRequestException(HTTP_ERROR_YOU_OWNER_ORG);
    }
    await this.organisationSrv.follow(id, user, organisation);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async unfollowOrganisation(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const organisation = (await this.organisationSrv.find({id}))[0];
    if (!organisation) {
      throw new NotFoundException(HTTP_ERROR_ORG_NOT_FOUND);
    }
    if (organisation.owner.id === user.id) {
      throw new BadRequestException(HTTP_ERROR_YOU_OWNER_ORG);
    }
    await this.organisationSrv.unfollow(id, user, organisation);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async joinOrganisation(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const organisation = (await this.organisationSrv.find({id}))[0];
    if (!organisation) {
      throw new NotFoundException(HTTP_ERROR_ORG_NOT_FOUND);
    }
    if (organisation.owner.id === user.id) {
      throw new BadRequestException(HTTP_ERROR_YOU_OWNER_ORG);
    }

    const promises = [];
    promises.push(this.organisationSrv.joinOrganisation(id, user, organisation));
    if (!organisation.followed) {
      promises.push(this.organisationSrv.follow(id, user, organisation));
    }

    await Promise.all(promises);
    return 'OK';
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async declineOrgInvite(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const organisation = (await this.organisationSrv.find({id}))[0];
    if (!organisation) {
      throw new NotFoundException(HTTP_ERROR_ORG_NOT_FOUND);
    }
    if (organisation.owner.id === user.id) {
      throw new BadRequestException(HTTP_ERROR_YOU_OWNER_ORG);
    }

    await this.organisationSrv.declineInvitation(id, user, organisation);
    return 'OK';
  }

  @Mutation(() => OrganisationDto)
  @UseGuards(JwtGuard)
  async createOrganisation(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => GraphQLUpload, name: 'upload', nullable: true}) file: FileUpload,
    @Args('input') input: OrganisationInputDto,
  ) {
    let s3file: ManagedUpload.SendData;
    if (file) {
      s3file = await this.fileSrv.fileUpload(file, `organisation/${Date.now()}/`);
      input.photoUrl = s3file.Location;
    }
    return this.organisationSrv.create(input, user);
  }

  @Mutation(() => OrganisationDto)
  @UseGuards(JwtGuard)
  async updateOrganisation (
      @Context(new FromContextPipe('req.user')) user: User,
      @Args({type: () => GraphQLUpload, name: 'upload', nullable: true}) file: FileUpload,
      @Args('input') input: OrganisationUpdateInputDto,
  ) {
      const organisation = (await this.organisationSrv.find({id: input.id}))[0];
      if (!organisation) {
        throw new NotFoundException(HTTP_ERROR_ORG_NOT_FOUND);
      }
      if (organisation.owner.id !== user.id) {
        throw new ForbiddenException();
      }
      let s3file: ManagedUpload.SendData;
      const oldFile = organisation.photoUrl;
      if (file) {
          s3file = await this.fileSrv.fileUpload(file, `organisation/${Date.now()}/`);
          await this.fileSrv.fileUpload(file, `organisation/${Date.now()}/`);
          input.photoUrl = s3file.Location;
      }
      const result = await this.organisationSrv.update(input, organisation, user);
      if (oldFile) {
        try {
          const parts = (oldFile || '').split('/');
          await this.fileSrv.deleteFile(parts.slice(parts.length - 3).join('/'));
        } catch (e) {
          console.log(e)
        }
      }
      return result;
  }

  @Mutation(() => String)
  @UseGuards(JwtGuard)
  async deleteOrganisation(
    @Context(new FromContextPipe('req.user')) user: User,
    @Args({type: () => Int, name: 'id'}) id: number,
  ) {
    const organisation = (await this.organisationSrv.find({id}))[0];
    if (!organisation) {
      throw new NotFoundException(HTTP_ERROR_ORG_NOT_FOUND);
    }
    if (organisation.owner.id !== user.id) {
      throw new ForbiddenException();
    }
    await this.organisationSrv.delete(id);
    return 'OK';
  }


  @Query(() => [OrganisationDto])
  @UseGuards(OptionalJwtGuard)
  async getPropularOrganisationsInCommunity(
    @Context(new FromContextPipe('req.user')) user: User,
  ){
    return this.organisationSrv.getPropularOrganisationsInCommunity(user)
  }
}
