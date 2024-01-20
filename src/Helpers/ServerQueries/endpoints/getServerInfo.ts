import { GeneratePostRequest } from '../RequestsManager';
import { GetServerInfo } from '../Types/';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
  GetServerInfo.RequestData,
  GetServerInfo.ResponseData,
  GetServerInfo.ResponseErrorTypes
>(GetServerInfo.endpoint, GetServerInfo.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  GetServerInfo.ResponseData,
  GetServerInfo.ResponseErrorTypes
>;

export * from '../Types/EndpointsApi/getServerInfo';
