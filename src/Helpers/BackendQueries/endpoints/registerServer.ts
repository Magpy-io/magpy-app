import { RegisterServer } from "../Types/";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";
import { GeneratePostRequest } from "../RequestsManager";

export const Post = GeneratePostRequest<
  RegisterServer.RequestData,
  RegisterServer.ResponseData,
  RegisterServer.ResponseErrorTypes
>(RegisterServer.endpoint, RegisterServer.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  RegisterServer.ResponseData,
  RegisterServer.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/registerServer";
