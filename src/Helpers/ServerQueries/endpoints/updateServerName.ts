import { GeneratePostRequest } from '../RequestsManager';
import { UpdateServerName } from '../Types/';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
  UpdateServerName.RequestData,
  UpdateServerName.ResponseData,
  UpdateServerName.ResponseErrorTypes
>(UpdateServerName.endpoint, UpdateServerName.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  UpdateServerName.ResponseData,
  UpdateServerName.ResponseErrorTypes
>;

export * from '../Types/EndpointsApi/updateServerName';
