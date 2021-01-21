import { Injectable, HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from '../config.service';
import * as qs from 'querystring';
import * as _ from 'lodash';
import { SocialUser } from './social.user';

@Injectable()
export class YahooService {
  appId;
  clientId;
  clientSecret;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.appId = config.get('YAHOO_APP_ID');
    this.clientId = config.get('YAHOO_CLIENT_ID');
    this.clientSecret = config.get('YAHOO_CLIENT_SECRET');
  }

  getAuthLink(url) {
    return `https://api.login.yahoo.com/oauth2/request_auth?client_id=${this.clientId}&redirect_uri=${url}&response_type=code`;
  }
  async getContacts(code): Promise<SocialUser[]> {
    const url = `https://api.login.yahoo.com/oauth2/get_token`;
    const result = await this.httpService.post(url, qs.stringify({
      code,
      grant_type: 'authorization_code',
      redirect_uri: 'oob',
    }), {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).toPromise();
    const contacts = await this.httpService.get(
      `https://social.yahooapis.com/v1/user/${result.data.xoauth_yahoo_guid}/contacts;count=10000?format=json`,
      {
        headers: {
          'Authorization': 'Bearer ' + result.data.access_token,
        },
      }).toPromise();


    return contacts.data.contacts.contact.map(u => {
      const name = (u.fields.find(f => f.type === 'name') || {value: {}} ).value;
      const email = (u.fields.find(f => f.type === 'email') || {}).value;

      return {
        id: u.id.toString(),
        username: [name.givenName, name.middleName, name.familyName].filter(p => p).join(' '),
        email,
        photoUrl: this.photoUrl(name.givenName + ' ' + name.familyName),
      };
    }).filter(u => u.email);
  }

  photoUrl(username) {
    const [first, ...parts] = username.split(' ');
    const last = parts[parts.length - 1] || ' ';

    const firstLeters = encodeURI((first[0] + ' ' + last[0]).toUpperCase());
    return `https://via.placeholder.com/300/6C9EA4/FFFFFF?text=${firstLeters}`;
  }


}
