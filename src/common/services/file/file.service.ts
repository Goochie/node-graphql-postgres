import { Injectable } from '@nestjs/common';

import * as AWS from 'aws-sdk';
import { FileUpload } from 'graphql-upload';
import { ManagedUpload, Types } from 'aws-sdk/clients/s3';
import { ConfigService } from '../config.service';
import * as sharp from 'sharp';
import { Stream } from 'stream';
import { oldlace } from 'color-name';

const s3 = new AWS.S3();

@Injectable()
export class FileService {
  private s3 = new AWS.S3({
    accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
  });

  constructor(private config: ConfigService) {
  }

  resize(w: number, h: number) {
    return sharp()
        .resize(w, h).toFormat('png');
  }

  async fileUpload(file: FileUpload, path: string, option: {resize?: 'avatar'} = {}): Promise<ManagedUpload.SendData> {
    return new Promise((resolve, reject) => {
      const body = new Stream.PassThrough();
      let name = Date.now() + '-' + file.filename;
      if (option.resize === 'avatar') {
        name = 'avatar.png';
      }
      const params = {
        Bucket: this.config.get('AWS_S3_BUCKET_NAME'),
        Key: path + name,
        Body: body,
        ACL: 'public-read',
      };

      this.s3.upload(params, (err, data: ManagedUpload.SendData) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });

      const fileStrean = file.createReadStream();
      if (option.resize === 'avatar') {
        fileStrean.pipe(this.resize(300, 300))
        .pipe(body);
      } else {
        fileStrean.pipe(body);
      }
    });
  }

  async copyFile(path: string, oldPath: string): Promise<ManagedUpload.SendData> {
    return new Promise((resolve, reject) => {

      this.s3.getObject({
        Bucket: this.config.get('AWS_S3_BUCKET_NAME'),
        Key: oldPath,
      }, (err, data) => {
        if (err) {
          return reject(err);
        }
        const params = {
          Bucket: this.config.get('AWS_S3_BUCKET_NAME'),
          Key: path,
          Body: data.Body,
          ACL: 'public-read',
        };

        this.s3.upload(params, (err, data: ManagedUpload.SendData) => {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });

      });
  });
  }

  async deleteFile(path: string): Promise<Types.DeleteObjectOutput> {
    return new Promise((resolve, reject) => {

      const params = {
        Bucket: this.config.get('AWS_S3_BUCKET_NAME'),
        Key: path,
      };

      this.s3.deleteObject(params, (err,  data: Types.DeleteObjectOutput) => {
        if (err) {
          return reject(err);
        }

      });
      return resolve();
    });
  }

}
