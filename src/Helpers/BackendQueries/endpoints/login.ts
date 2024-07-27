import { GeneratePostRequest } from '../RequestsManager';
import { Login } from '../Types/';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
  Login.RequestData,
  Login.ResponseData,
  Login.ResponseErrorTypes
>(Login.endpoint, Login.tokenAuth);

export type ResponseType = ResponseTypeFrom<Login.ResponseData, Login.ResponseErrorTypes>;

export * from '../Types/EndpointsApi/login';
