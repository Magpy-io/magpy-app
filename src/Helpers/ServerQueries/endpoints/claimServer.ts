import { ClaimServer } from "../Types/";
import { GeneratePostRequest } from "../RequestsManager";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";

export const Post = GeneratePostRequest<
  ClaimServer.RequestData,
  ClaimServer.ResponseData,
  ClaimServer.ResponseErrorTypes
>(ClaimServer.endpoint, ClaimServer.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  ClaimServer.ResponseData,
  ClaimServer.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/claimServer";
