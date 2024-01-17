import { GetPhotosById } from "../Types/";
import { GeneratePostRequest } from "../RequestsManager";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";

export const Post = GeneratePostRequest<
  GetPhotosById.RequestData,
  GetPhotosById.ResponseData,
  GetPhotosById.ResponseErrorTypes
>(GetPhotosById.endpoint, GetPhotosById.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  GetPhotosById.ResponseData,
  GetPhotosById.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/getPhotosById";
