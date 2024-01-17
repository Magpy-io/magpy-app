import { GetPhotosByPath } from "../Types/";
import { GeneratePostRequest } from "../RequestsManager";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";

export const Post = GeneratePostRequest<
  GetPhotosByPath.RequestData,
  GetPhotosByPath.ResponseData,
  GetPhotosByPath.ResponseErrorTypes
>(GetPhotosByPath.endpoint, GetPhotosByPath.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  GetPhotosByPath.ResponseData,
  GetPhotosByPath.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/getPhotosByPath";
