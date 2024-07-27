import { GeneratePostRequest } from '../RequestsManager';
import { Status } from '../Types/';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
  Status.RequestData,
  Status.ResponseData,
  Status.ResponseErrorTypes
>(Status.endpoint, Status.tokenAuth);

export type ResponseType = ResponseTypeFrom<Status.ResponseData, Status.ResponseErrorTypes>;

export * from '../Types/EndpointsApi/status';
