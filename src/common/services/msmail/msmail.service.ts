import { Injectable, HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from '../config.service';
import * as qs from 'querystring';
import * as _ from 'lodash';
import { SocialUser } from '../yahoo/social.user';

@Injectable()
export class MSMailService {
  clientId;
  tenant;
  clientSecret;
  scope = [
    'openid',
    'offline_access',
    'Contacts.Read',
    'User.Read',
  ];

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.clientId = config.get('MS_CLIENT_ID');
    this.tenant = config.get('MS_TENANT');
    this.clientSecret = config.get('MS_CLIENT_SECRET');
  }

  getAuthLink(url) {
    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
client_id=${this.clientId}
&response_type=code
&redirect_uri=${url}
&response_mode=query
&prompt=consent
&scope=${encodeURIComponent(this.scope.join(' '))}
&state=${Date.now()}`;
  }
  async getContacts(code, redirect_uri): Promise<SocialUser[]> {
    const url = `https://login.microsoftonline.com/common/oauth2/v2.0/token`;
    try {
      const result = await this.httpService.post(url, qs.stringify({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri,
        scope: this.scope.join(' '),
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }}).toPromise();
      const contacts = await this.httpService.get(
        `https://graph.microsoft.com/v1.0/me/contacts?$top=2000`,
        {
          headers: {
            'Authorization': 'Bearer ' + result.data.access_token,
            'Content-Type': 'application/json',
          },
        }).toPromise();

      const contactArray = contacts.data.value || [];

      return contactArray.map(u => {
        const username = u.displayName;
        const email = _.get(u, 'emailAddresses.0.address');
        return {
          id: u.id,
          username,
          email,
          photoUrl: this.photoUrl(username),
        };
      }).filter(u => u.email);
    } catch (e) {
      if (_.get(e, 'response.data.error.code') === 'OrganizationFromTenantGuidNotFound') {
        console.log(_.get(e, 'response.data'));
        return [];
      }
      console.log(e);
      console.log(_.get(e, 'response.data'));
      throw e;
    }
  }

  photoUrl(username) {
    const [first, ...parts] = username.split(' ');
    const last = parts[parts.length - 1] || ' ';

    const firstLeters = encodeURI((first[0] + ' ' + last[0]).toUpperCase());
    return `https://via.placeholder.com/300/6C9EA4/FFFFFF?text=${firstLeters}`;
  }


}
