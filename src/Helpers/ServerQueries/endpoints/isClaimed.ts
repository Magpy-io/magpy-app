import { GeneratePostRequest } from '../RequestsManager';
import { IsClaimed } from '../Types/';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
  IsClaimed.RequestData,
  IsClaimed.ResponseData,
  IsClaimed.ResponseErrorTypes
>(IsClaimed.endpoint, IsClaimed.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  IsClaimed.ResponseData,
  IsClaimed.ResponseErrorTypes
>;

export * from '../Types/EndpointsApi/isClaimed';
