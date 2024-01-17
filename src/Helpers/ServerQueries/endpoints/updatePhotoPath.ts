import { UpdatePhotoPath } from "../Types/";
import { GeneratePostRequest } from "../RequestsManager";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";

export const Post = GeneratePostRequest<
  UpdatePhotoPath.RequestData,
  UpdatePhotoPath.ResponseData,
  UpdatePhotoPath.ResponseErrorTypes
>(UpdatePhotoPath.endpoint, UpdatePhotoPath.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  UpdatePhotoPath.ResponseData,
  UpdatePhotoPath.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/updatePhotoPath";
