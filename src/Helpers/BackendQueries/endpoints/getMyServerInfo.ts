import { GetMyServerInfo } from "../Types/";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";
import { GeneratePostRequest } from "../RequestsManager";

export const Post = GeneratePostRequest<
  GetMyServerInfo.RequestData,
  GetMyServerInfo.ResponseData,
  GetMyServerInfo.ResponseErrorTypes
>(GetMyServerInfo.endpoint, GetMyServerInfo.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  GetMyServerInfo.ResponseData,
  GetMyServerInfo.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/getMyServerInfo";
