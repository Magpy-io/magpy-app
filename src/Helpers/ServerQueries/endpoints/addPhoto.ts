import { GeneratePostRequest } from '../RequestsManager';
import { AddPhoto } from '../Types/';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
  AddPhoto.RequestData,
  AddPhoto.ResponseData,
  AddPhoto.ResponseErrorTypes
>(AddPhoto.endpoint, AddPhoto.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  AddPhoto.ResponseData,
  AddPhoto.ResponseErrorTypes
>;

export * from '../Types/EndpointsApi/addPhoto';
