import * as mockValues from '../mockValues';

import { SetUserToken } from '../../TokenManager';
import { Login } from '../../Types/';
import { ResponseTypeFrom } from '../../Types/ApiGlobalTypes';

export const Post = async (data: Login.RequestData): Promise<ResponseType> => {
  await mockValues.timeout(10);
  const f = mockValues.checkFails();
  if (f) {
    return f;
  }

  if (
    data.email != mockValues.validUserEmail ||
    data.password != mockValues.validUserPassword
  ) {
    return {
      ok: false,
      errorCode: 'INVALID_CREDENTIALS',
      message: '',
    };
  }

  SetUserToken(mockValues.validUserToken);

  return {
    ok: true,
    data: '',
  };
};

export type ResponseType = ResponseTypeFrom<Login.ResponseData, Login.ResponseErrorTypes>;

export * from '../../Types/EndpointsApi/login';
