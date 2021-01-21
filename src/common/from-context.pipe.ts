import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import * as _ from 'lodash';
@Injectable()
export class FromContextPipe implements PipeTransform {
  constructor(private path: string) {}
  transform(value: any, metadata: ArgumentMetadata) {
    return _.get(value, this.path);
  }
}
