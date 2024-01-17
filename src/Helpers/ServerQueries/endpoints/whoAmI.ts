import { WhoAmI } from "../Types/";
import { GeneratePostRequest } from "../RequestsManager";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";

export const Post = GeneratePostRequest<
  WhoAmI.RequestData,
  WhoAmI.ResponseData,
  WhoAmI.ResponseErrorTypes
>(WhoAmI.endpoint, WhoAmI.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  WhoAmI.ResponseData,
  WhoAmI.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/whoAmI";
