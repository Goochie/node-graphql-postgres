import { Injectable, HttpService } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ConfigService } from '../config.service';
import * as qs from 'querystring';
import * as _ from 'lodash';
import { SocialUser } from '../yahoo/social.user';

@Injectable()
export class GoogleService {
  clientId;
  clientSecret;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.clientId = config.get('GOOGLE_CLIENT_ID');
    this.clientSecret = config.get('GOOGLE_CLIENT_SECRET');
  }

  getAuthLink(url) {
    return `https://accounts.google.com/o/oauth2/v2/auth?\
scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcontacts.readonly&\
access_type=offline&\
include_granted_scopes=true&\
state=state_parameter_passthrough_value&\
redirect_uri=${url}&\
response_type=code&\
client_id=${this.clientId}`;
  }
  async getContacts(code, redirect_uri): Promise<SocialUser[]> {
    const url = `https://oauth2.googleapis.com/token`;
    try {
      const result = await this.httpService.post(url, qs.stringify({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }}).toPromise();
      // {
      //   "access_token":"1/fFAGRNJru1FTz70BzhT3Zg",
      //   "expires_in":3920,
      //   "token_type":"Bearer",
      //   "refresh_token":"1/xEoDL4iW3cxlI7yDbSRFYNG01kVKM2C-259HOF2aQbI"
      // }
      const contacts = await this.httpService.get(
        `https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,photos&pageSize=1999`,
        {
          headers: {
            'Authorization': 'Bearer ' + result.data.access_token,
          },
        }).toPromise();

      const contactArray = contacts.data.connections || [];

      return contactArray.map((u,index) => {
        const username = u.names !== undefined ? u.names[0].displayName:'';
        const email = u.emailAddresses !== undefined ? u.emailAddresses[0].value:null;
        const photoUrl = u.photos !== undefined ? u.photos[0].url:null;
        return {
          id: u.etag,
          username,
          email,
          photoUrl,
        };
      }).filter(u => u.email!==null);

    } catch (e) {
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
