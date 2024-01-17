import { GetToken } from "../Types/";
import { GeneratePostRequest } from "../RequestsManager";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";

export const Post = GeneratePostRequest<
  GetToken.RequestData,
  GetToken.ResponseData,
  GetToken.ResponseErrorTypes
>(GetToken.endpoint, GetToken.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  GetToken.ResponseData,
  GetToken.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/getToken";
