import { UnclaimServer } from "../Types/";
import { GeneratePostRequest } from "../RequestsManager";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";

export const Post = GeneratePostRequest<
  UnclaimServer.RequestData,
  UnclaimServer.ResponseData,
  UnclaimServer.ResponseErrorTypes
>(UnclaimServer.endpoint, UnclaimServer.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  UnclaimServer.ResponseData,
  UnclaimServer.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/unclaimServer";
