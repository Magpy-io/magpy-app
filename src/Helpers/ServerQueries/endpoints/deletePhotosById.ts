import { DeletePhotosById } from "../Types/";
import { GeneratePostRequest } from "../RequestsManager";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";

export const Post = GeneratePostRequest<
  DeletePhotosById.RequestData,
  DeletePhotosById.ResponseData,
  DeletePhotosById.ResponseErrorTypes
>(DeletePhotosById.endpoint, DeletePhotosById.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  DeletePhotosById.ResponseData,
  DeletePhotosById.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/deletePhotosById";
