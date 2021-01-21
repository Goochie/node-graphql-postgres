import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThemeImages } from './theme-images.entity';
import { Repository } from 'typeorm';
import { FileService } from '../common/services/file/file.service';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class ThemeImagesService {
  constructor(
    @InjectRepository(ThemeImages)
    private readonly imageRepository: Repository<ThemeImages>,
    private readonly fileSrv: FileService,
  ) {}

  getImages(isSquare: boolean) {
    return this.imageRepository.find({where: [{user: null, isSquare}]});
  }

  getMyImages(userId: number, isSquare?: boolean) {
    return this.imageRepository.find({where: [{user: null, isSquare}, {user: {id: userId}}]});
  }

  async createImage(userId: number, file: FileUpload) {
    const s3file = await this.fileSrv.fileUpload(file, `images/${Date.now()}/`);
    const image = new ThemeImages();
    image.key = s3file.Key;
    image.url = s3file.Location;
    image.user = {id: userId};
    try {
      return await this.imageRepository.save(image);
    } catch (e) {
      this.fileSrv.deleteFile(s3file.Key);
      throw e;
    }
  }
}
