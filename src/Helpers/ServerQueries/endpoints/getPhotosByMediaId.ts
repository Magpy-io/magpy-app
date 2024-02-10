import { GeneratePostRequest } from '../RequestsManager';
import { GetPhotosByMediaId } from '../Types';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
  GetPhotosByMediaId.RequestData,
  GetPhotosByMediaId.ResponseData,
  GetPhotosByMediaId.ResponseErrorTypes
>(GetPhotosByMediaId.endpoint, GetPhotosByMediaId.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  GetPhotosByMediaId.ResponseData,
  GetPhotosByMediaId.ResponseErrorTypes
>;

export * from '../Types/EndpointsApi/getPhotosByMediaId';
