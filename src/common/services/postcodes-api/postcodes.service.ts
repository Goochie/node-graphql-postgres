import { Injectable, HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class PostcodesApiService {
  constructor(private readonly httpService: HttpService) {}
  api = 'http://api.postcodes.io/postcodes/';
  async checkPostcode(postcode): Promise<any> {
    try {
      const res: AxiosResponse<any> = await this.httpService.get(`${this.api}${postcode}`).toPromise();
      return res.data.result;
    } catch {
      return false;
    }
  }
}
