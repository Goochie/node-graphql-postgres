import {Injectable, HttpService} from '@nestjs/common';
import {AxiosResponse} from 'axios';

@Injectable()
export class DarkskysService {

    readonly DARK_SKY_KEY = 'a59b392175c43a04d149f3ac6ed16a39';
    readonly API = 'https://api.darksky.net/forecast/';

    constructor(private readonly httpService: HttpService) {

    }

    async getLocalEnvironmentInfo(lat = '51.35', long = '-0.35'): Promise<any> {

        // https://api.darksky.net/forecast/a59b392175c43a04d149f3ac6ed16a39/37.8267,-122.4233

        try {
            const res: AxiosResponse<any> = await this.httpService.get(`${this.API}${this.DARK_SKY_KEY}/${lat},${long}`).toPromise();
            return res.data.result;
        } catch {
            return false;
        }
    }

}
