import { GetLastWarning } from "../Types/";
import { GeneratePostRequest } from "../RequestsManager";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";

export const Post = GeneratePostRequest<
  GetLastWarning.RequestData,
  GetLastWarning.ResponseData,
  GetLastWarning.ResponseErrorTypes
>(GetLastWarning.endpoint, GetLastWarning.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  GetLastWarning.ResponseData,
  GetLastWarning.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/getLastWarning";
