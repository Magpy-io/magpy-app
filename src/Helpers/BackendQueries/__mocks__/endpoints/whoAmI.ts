import * as mockValues from '../mockValues';

import { GetUserToken, verifyHasUserToken } from '../../TokenManager';
import { WhoAmI } from '../../Types/';
import { ResponseTypeFrom } from '../../Types/ApiGlobalTypes';

export const Post = async (data: WhoAmI.RequestData): Promise<ResponseType> => {
  verifyHasUserToken();
  await mockValues.timeout(10);
  const f = mockValues.checkFails();
  if (f) {
    return f as any;
  }

  if (GetUserToken() == mockValues.expiredUserToken) {
    return {
      ok: false,
      errorCode: 'AUTHORIZATION_EXPIRED',
      message: '',
    };
  }

  if (
    GetUserToken() != mockValues.validUserToken &&
    GetUserToken() != mockValues.validUserToken2
  ) {
    return {
      ok: false,
      errorCode: 'AUTHORIZATION_FAILED',
      message: '',
    };
  }

  return {
    ok: true,
    data: {
      user: {
        _id:
          GetUserToken() == mockValues.validUserToken ? mockValues.userId : mockValues.userId2,
        email: mockValues.validUserEmail,
        name: mockValues.validUserName,
        serverId: mockValues.serverId,
      },
    },
  };
};

export type ResponseType = ResponseTypeFrom<WhoAmI.ResponseData, WhoAmI.ResponseErrorTypes>;

export * from '../../Types/EndpointsApi/whoAmI';
