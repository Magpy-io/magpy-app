import { AddPhotoInit } from "../Types/";
import { GeneratePostRequest } from "../RequestsManager";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";

export const Post = GeneratePostRequest<
  AddPhotoInit.RequestData,
  AddPhotoInit.ResponseData,
  AddPhotoInit.ResponseErrorTypes
>(AddPhotoInit.endpoint, AddPhotoInit.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  AddPhotoInit.ResponseData,
  AddPhotoInit.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/addPhotoInit";
