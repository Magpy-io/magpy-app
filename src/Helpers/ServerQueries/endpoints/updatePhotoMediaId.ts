import { GeneratePostRequest } from '../RequestsManager';
import { UpdatePhotoMediaId } from '../Types';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
  UpdatePhotoMediaId.RequestData,
  UpdatePhotoMediaId.ResponseData,
  UpdatePhotoMediaId.ResponseErrorTypes
>(UpdatePhotoMediaId.endpoint, UpdatePhotoMediaId.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  UpdatePhotoMediaId.ResponseData,
  UpdatePhotoMediaId.ResponseErrorTypes
>;

export * from '../Types/EndpointsApi/updatePhotoMediaId';
