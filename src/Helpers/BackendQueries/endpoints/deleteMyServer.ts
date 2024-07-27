import { GeneratePostRequest } from '../RequestsManager';
import { DeleteMyServer } from '../Types/';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
  DeleteMyServer.RequestData,
  DeleteMyServer.ResponseData,
  DeleteMyServer.ResponseErrorTypes
>(DeleteMyServer.endpoint, DeleteMyServer.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  DeleteMyServer.ResponseData,
  DeleteMyServer.ResponseErrorTypes
>;

export * from '../Types/EndpointsApi/deleteMyServer';
