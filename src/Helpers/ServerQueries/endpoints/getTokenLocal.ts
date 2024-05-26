import { GeneratePostRequest } from '../RequestsManager';
import { GetTokenLocal } from '../Types/';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
GetTokenLocal.RequestData,
  GetTokenLocal.ResponseData,
  GetTokenLocal.ResponseErrorTypes
>(GetTokenLocal.endpoint, GetTokenLocal.tokenAuth);

export type ResponseType = ResponseTypeFrom<
GetTokenLocal.ResponseData,
GetTokenLocal.ResponseErrorTypes
>;

export * from '../Types/EndpointsApi/getTokenLocal';
