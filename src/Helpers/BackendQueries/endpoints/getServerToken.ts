import { GeneratePostRequest } from '../RequestsManager';
import { GetServerToken } from '../Types/';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
  GetServerToken.RequestData,
  GetServerToken.ResponseData,
  GetServerToken.ResponseErrorTypes
>(GetServerToken.endpoint, GetServerToken.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  GetServerToken.ResponseData,
  GetServerToken.ResponseErrorTypes
>;

export * from '../Types/EndpointsApi/getServerToken';
