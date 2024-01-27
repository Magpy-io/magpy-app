import axios from 'axios';

import { handleAxiosError } from './ExceptionsManager';
import { getPathWithEndpoint } from './PathManager';
import {
  SetUserToken,
  extractToken,
  userAuthorizationObject,
  verifyHasUserToken,
} from './TokenManager';
import { ResponseTypeFrom } from './Types/ApiGlobalTypes';
import { TokenAuthentification } from './Types/Types';

function GeneratePostWithAuth<RequestData, ResponseData, ResponseErrorTypes>(
  endpointPath: string,
) {
  const PostFunction = async <RequestData, ResponseData, ResponseErrorTypes>(
    data: RequestData,
    options?: { path?: string },
  ): Promise<ResponseTypeFrom<ResponseData, ResponseErrorTypes>> => {
    verifyHasUserToken();
    try {
      const response = await axios.post(
        getPathWithEndpoint(endpointPath, options?.path),
        data,
        userAuthorizationObject(),
      );
      return response.data;
    } catch (err: any) {
      return handleAxiosError(err);
    }
  };
  return PostFunction;
}

function GeneratePostWithNoAuth<RequestData, ResponseData, ResponseErrorTypes>(
  endpointPath: string,
) {
  const PostFunction = async <RequestData, ResponseData, ResponseErrorTypes>(
    data: RequestData,
    options?: { path?: string },
  ): Promise<ResponseTypeFrom<ResponseData, ResponseErrorTypes>> => {
    try {
      const response = await axios.post(
        getPathWithEndpoint(endpointPath, options?.path),
        data,
      );
      return response.data;
    } catch (err: any) {
      return handleAxiosError(err);
    }
  };
  return PostFunction;
}

function GeneratePostSetAuth<RequestData, ResponseData, ResponseErrorTypes>(
  endpointPath: string,
) {
  const PostFunction = async <RequestData, ResponseData, ResponseErrorTypes>(
    data: RequestData,
    options?: { path?: string },
  ): Promise<ResponseTypeFrom<ResponseData, ResponseErrorTypes>> => {
    try {
      const response = await axios.post(
        getPathWithEndpoint(endpointPath, options?.path),
        data,
      );
      const token = extractToken(response);
      SetUserToken(token);
      return response.data;
    } catch (err: any) {
      return handleAxiosError(err);
    }
  };
  return PostFunction;
}

type FunctionType<RequestData, ResponseData, ResponseErrorTypes> = {} extends RequestData
  ? (
      data?: RequestData,
      options?: { path?: string },
    ) => Promise<ResponseTypeFrom<ResponseData, ResponseErrorTypes>>
  : (
      data: RequestData,
      options?: { path?: string },
    ) => Promise<ResponseTypeFrom<ResponseData, ResponseErrorTypes>>;

export function GeneratePostRequest<RequestData, ResponseData, ResponseErrorTypes>(
  endpointPath: string,
  tokenAuth: TokenAuthentification,
): FunctionType<RequestData, ResponseData, ResponseErrorTypes> {
  switch (tokenAuth) {
    case 'yes':
      return GeneratePostWithAuth<RequestData, ResponseData, ResponseErrorTypes>(endpointPath);

    case 'no':
      return GeneratePostWithNoAuth<RequestData, ResponseData, ResponseErrorTypes>(
        endpointPath,
      );
    case 'set-token':
      return GeneratePostSetAuth<RequestData, ResponseData, ResponseErrorTypes>(endpointPath);
  }
}
