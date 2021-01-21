import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventDocument } from './event-document.entity';
import { Repository } from 'typeorm';
import { FileService } from '../common/services/file/file.service';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class EventDocumentService {
  constructor(
    @InjectRepository(EventDocument)
    private readonly docRepository: Repository<EventDocument>,
    private readonly fileSrv: FileService,
  ) {}

  async uploadDocument(userId: number, file: FileUpload, filename: string, filesize: number, filetype: string) {
    const s3file = await this.fileSrv.fileUpload(file, `documents/${Date.now()}/`);
    const doc = new EventDocument();
    doc.key = s3file.Key;
    doc.url = s3file.Location;
    doc.user = {id: userId};
    doc.filename = filename;
    doc.filesize = filesize;
    doc.filetype = filetype;
    try {
      return await this.docRepository.save(doc);
    } catch (e) {
      this.fileSrv.deleteFile(s3file.Key);
      throw e;
    }
  }

  async find(id) {
    return await this.docRepository.findOne({where: {id}});
  }

  async save(doc) {
    return await this.docRepository.save(doc);
  }
}
