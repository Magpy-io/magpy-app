import { GeneratePostRequest } from '../RequestsManager';
import { UpdateServerPath } from '../Types/';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
  UpdateServerPath.RequestData,
  UpdateServerPath.ResponseData,
  UpdateServerPath.ResponseErrorTypes
>(UpdateServerPath.endpoint, UpdateServerPath.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  UpdateServerPath.ResponseData,
  UpdateServerPath.ResponseErrorTypes
>;

export * from '../Types/EndpointsApi/updateServerPath';
