import { DeleteServer } from "../Types/";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";
import { GeneratePostRequest } from "../RequestsManager";

export const Post = GeneratePostRequest<
  DeleteServer.RequestData,
  DeleteServer.ResponseData,
  DeleteServer.ResponseErrorTypes
>(DeleteServer.endpoint, DeleteServer.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  DeleteServer.ResponseData,
  DeleteServer.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/deleteServer";
