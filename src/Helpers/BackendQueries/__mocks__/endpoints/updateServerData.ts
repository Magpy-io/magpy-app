import * as mockValues from '../mockValues';

import { GetServerToken, verifyHasServerToken } from '../../TokenManager';
import { UpdateServerData } from '../../Types/';
import { ResponseTypeFrom } from '../../Types/ApiGlobalTypes';

export const Post = async (data: UpdateServerData.RequestData): Promise<ResponseType> => {
  verifyHasServerToken();
  await mockValues.timeout(10);
  const f = mockValues.checkFails();
  if (f) {
    return f;
  }

  if (GetServerToken() == mockValues.expiredServerToken) {
    return {
      ok: false,
      errorCode: 'AUTHORIZATION_EXPIRED',
      message: '',
    };
  }

  if (GetServerToken() != mockValues.validServerToken) {
    return {
      ok: false,
      errorCode: 'AUTHORIZATION_FAILED',
      message: '',
    };
  }

  return {
    ok: true,
    data: '',
  };
};

export type ResponseType = ResponseTypeFrom<
  UpdateServerData.ResponseData,
  UpdateServerData.ResponseErrorTypes
>;

export * from '../../Types/EndpointsApi/updateServerData';
