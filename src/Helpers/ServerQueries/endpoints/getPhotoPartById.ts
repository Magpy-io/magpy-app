import { GeneratePostRequest } from '../RequestsManager';
import { GetPhotoPartById } from '../Types/';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
  GetPhotoPartById.RequestData,
  GetPhotoPartById.ResponseData,
  GetPhotoPartById.ResponseErrorTypes
>(GetPhotoPartById.endpoint, GetPhotoPartById.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  GetPhotoPartById.ResponseData,
  GetPhotoPartById.ResponseErrorTypes
>;

export * from '../Types/EndpointsApi/getPhotoPartById';
