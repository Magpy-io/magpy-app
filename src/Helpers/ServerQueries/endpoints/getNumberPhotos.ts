import { GeneratePostRequest } from '../RequestsManager';
import { GetNumberPhotos } from '../Types/';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
  GetNumberPhotos.RequestData,
  GetNumberPhotos.ResponseData,
  GetNumberPhotos.ResponseErrorTypes
>(GetNumberPhotos.endpoint, GetNumberPhotos.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  GetNumberPhotos.ResponseData,
  GetNumberPhotos.ResponseErrorTypes
>;

export * from '../Types/EndpointsApi/getNumberPhotos';
