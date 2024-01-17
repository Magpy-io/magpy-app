import { GetPhotos } from "../Types/";
import { GeneratePostRequest } from "../RequestsManager";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";

export const Post = GeneratePostRequest<
  GetPhotos.RequestData,
  GetPhotos.ResponseData,
  GetPhotos.ResponseErrorTypes
>(GetPhotos.endpoint, GetPhotos.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  GetPhotos.ResponseData,
  GetPhotos.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/getPhotos";
