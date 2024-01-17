import { UpdateServerData } from "../Types/";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";
import { GeneratePostRequest } from "../RequestsManager";

export const Post = GeneratePostRequest<
  UpdateServerData.RequestData,
  UpdateServerData.ResponseData,
  UpdateServerData.ResponseErrorTypes
>(UpdateServerData.endpoint, UpdateServerData.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  UpdateServerData.ResponseData,
  UpdateServerData.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/updateServerData";
