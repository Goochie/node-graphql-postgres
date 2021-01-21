import { Injectable } from '@nestjs/common';
import { IsNull, In, Repository, getManager, FindManyOptions, DeepPartial } from 'typeorm';
import { Community } from './community.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid/v4';
import { District } from './district.entity';
import { County } from './county.entity';


@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
    @InjectRepository(County)
    private readonly countyRepository: Repository<County>,
  ) {}

    async getCommunityById(id: string) {
      const community = await this.communityRepository.createQueryBuilder('community')
      .select()
      .leftJoinAndSelect('community.localCouncil', 'localCouncil')
      .where({community_id: id})
      .getOne();

      const [district, county] = await Promise.all([
        this.districtRepository.findOne({where: {district_id: community.county_or_district_id}, relations: ['county']}),
        this.countyRepository.findOne({where: {county_id: community.county_or_district_id}} ),
      ]);
      if (district) {
        community.district = district;
        community.county = district.county;
      } else {
        community.county = county;
      }

      return community;
    }
}
