import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Request } from './request.entity';
import { HTTP_ERROR_REQUEST_NOT_FOUND } from '../common/helpers/http-error-helper';
import { EmailService } from '../common/services/email/email.service';
import { PostcodeService } from '../postcode/postcode.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class RequestService {
  relations = ['owner', 'volunteer'];

  constructor(
    @InjectRepository(Request)
    private readonly requestRepo: Repository<Request>,
    private readonly emailSrv: EmailService,
    private readonly postcode: PostcodeService,
    private readonly user: UserService,
  ) {

  }

  async findRequests(community: string) {
    return await this.requestRepo.find({
      where: {
        community,
        deletedDate: IsNull()
      },
      relations: this.relations
    });
  }

  async createRequest(description: string, community: string, owner: User) {
    const req = await this.requestRepo.save(new Request({ description, community, owner }));
    const postcodeIds = (await this.postcode.findCommunity(community)).map(p => p.id);
    const users = (await this.user.findByPostcodes(postcodeIds));
    for (const user of users) {
      this.emailSrv.sendEmail(user.email, 'You got a new request for help', 'created_request', {
        req,
        volunteer: user.username
      });
    }
    return req;
  }

  async deleteRequest(id: number, community: string, owner: User) {
    let req = await this.requestRepo.findOne({
      where: {
        id,
        community,
        deletedDate: IsNull()
      },
      relations: this.relations
    });
    if(!req) {
      throw new NotFoundException(HTTP_ERROR_REQUEST_NOT_FOUND);
    }
    req.deletedDate = new Date();
    req = await this.requestRepo.save(req);
    const postcodeIds = (await this.postcode.findCommunity(community)).map(p => p.id);
    const users = (await this.user.findByPostcodes(postcodeIds));
    for (const user of users) {
      this.emailSrv.sendEmail(user.email, 'The request for help was cancelled', 'deleted_request', {
        req
      });
    }
    return req;
  }

  async acceptRequest(id: number, community: string, volunteer: User) {
    let req = await this.requestRepo.findOne({
      where: {
        id,
        community,
        volunteer: IsNull(),
        deletedDate: IsNull()
      },
      relations: this.relations
    });
    if(!req) {
      throw new NotFoundException(HTTP_ERROR_REQUEST_NOT_FOUND);
    }
    req.volunteer = volunteer;
    req.fulfilledDate = null;
    req = await this.requestRepo.save(req);
    this.emailSrv.sendEmail(req.owner.email, 'Your request for help was accepted', 'accepted_request', {
      req
    });
    return req;
  }

  async cancelRequest(id: number, community: string, volunteer: User) {
    const req = await this.requestRepo.findOne({
      where: {
        id,
        community,
        volunteer: {
          id: volunteer.id
        },
        deletedDate: IsNull()
      },
      relations: this.relations
    });
    if(!req) {
      throw new NotFoundException(HTTP_ERROR_REQUEST_NOT_FOUND);
    }
    req.volunteer = null;
    req.fulfilledDate = null;
    return await this.requestRepo.save(req);
  }

  async fulfillRequest(id: number, community: string, volunteer: User) {
    const req = await this.requestRepo.findOne({
      where: {
        id,
        community,
        volunteer: {
          id: volunteer.id
        },
        deletedDate: IsNull()
      },
      relations: this.relations
    });
    if(!req) {
      throw new NotFoundException(HTTP_ERROR_REQUEST_NOT_FOUND);
    }
    req.volunteer = volunteer;
    req.fulfilledDate = new Date();
    return await this.requestRepo.save(req);
  }
}
