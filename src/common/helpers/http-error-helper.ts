import { BadRequestException } from '@nestjs/common';

export class HttpErrorHelper {

  static checkDataBaseError(err) {
    if (['42703', '22001'].indexOf(err.code) !== -1) {
      throw new BadRequestException('Incorrect data to save');
    }
    if (err.code === '23505') {
      throw new BadRequestException({
        message: [{
          property: err.detail.match(/\(([^)]*)\)/)[1],
          constraints: {
            error: err.detail.match(/\)=\(.*\)(.*)$/)[1],
          },
        }],
      });
    }
  }

}

export const HTTP_ERROR_YOU_OWNER_ORG = 'You are owner of organisation';
export const HTTP_ERROR_ORG_NOT_FOUND = 'Organisation not found';

export const HTTP_ERROR_YOU_OWNER_EVENT = 'You are owner of event';
export const HTTP_ERROR_EVENT_NOT_FOUND = 'Event not found';

export const HTTP_ERROR_YOU_OWNER_EVENT_GROUP = 'You are owner of event group';
export const HTTP_ERROR_EVENT_GROUP_NOT_FOUND = 'Event Group not found';

export const HTTP_ERROR_YOU_OWNER_FUND = 'You are owner of fund';
export const HTTP_ERROR_FUND_NOT_FOUND = 'Fund not found';

export const HTTP_ERROR_UPDATE_NOT_FOUND = 'Update not found';

export const HTTP_ERROR_MESSAGE_NOT_FOUND = 'Message not found';
export const HTTP_ERROR_COMMUNITY_NOT_FOUND = 'Community not found';

export const HTTP_ERROR_PROFILE_NOT_FOUND = 'Profile not found';

export const HTTP_ERROR_PRODUCT_NOT_FOUND = 'Product not found';

export const HTTP_PERMISSION_DENIDE = 'Permission dinide';

export const HTTP_ERROR_YOU_NOT_OWNER_ORG = 'You are not owner of organisation';

export const HTTP_ERROR_YOU_NOT_CONFIGURED = 'You are not configured for support';
export const HTTP_ERROR_YOU_NOT_REQUIRED = 'You cannot send requests';
export const HTTP_ERROR_YOU_NOT_VOLUNTEER = 'You are not volunteer';
export const HTTP_ERROR_REQUEST_NOT_FOUND = 'Request not found';
