import { Injectable, BadRequestException } from '@nestjs/common';
import { PostCode } from './post-code.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { PostcodesApiService } from '../common/services/postcodes-api/postcodes.service';

export const MILLE = 1609.344;
@Injectable()
export class PostcodeService {
  constructor(
    @InjectRepository(PostCode)
    private readonly postcodeRepository: Repository<PostCode>,
    private readonly postcodeSrv: PostcodesApiService,
  ) {}

  async findOne(where) {
    return this.postcodeRepository.findOne({where});
  }

  async findCommunity(community) {
    return this.postcodeRepository.find({where: {communityId: community}});
  }

  async findOrCreate(postcodeString: string, transactionalEntityManager: EntityManager) {
    let postcode: PostCode = await this.findOne({postcode: postcodeString});
    if (!postcode) {
      const postcodeResponce = await this.postcodeSrv.checkPostcode(postcodeString);
      if (!postcodeResponce) {
        throw new BadRequestException({
          message: [{
            property: 'postcode',
            constraints: {
              error: 'Post code Invalid',
            },
          }],
        });
      }
      postcode = await transactionalEntityManager.save(PostCode, {
        postcode: postcodeString,
        communityId: postcodeResponce.codes.admin_ward,
        coordinates: {
          type: 'Point',
          coordinates: [postcodeResponce.longitude, postcodeResponce.latitude],
        },
      });
    }
    return postcode;
  }

  async searchNear(coordinates: [number, number], radius: number) {
    return await this.postcodeRepository.createQueryBuilder('postcode')
    .select()
    .where(`ST_Distance(
			ST_Transform('SRID=4326;POINT(${coordinates[0]} ${coordinates[1]})'::geometry, 3857),
			ST_Transform(coordinates , 3857)
    ) * cosd(${coordinates[1]}) < ${radius * MILLE}`)
    .getMany();
  }

  async getPostcodesWithIncreasedRadius(postcodes: PostCode[], radius: number = 5){
    const additionalPostcodeIdsPromises = postcodes.map(async postcode => {
      const newPostcodes = await this.searchNear(postcode.coordinates.coordinates as [number, number], radius)
      const newPostcodesIds = newPostcodes.map(p => p.id);
      
      return newPostcodesIds;
    })

    const additionalPostcodeIds = await Promise.all(additionalPostcodeIdsPromises);


    return additionalPostcodeIds;
  }

}
