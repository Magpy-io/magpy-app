import { GeneratePostRequest } from '../RequestsManager';
import { Register } from '../Types/';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
  Register.RequestData,
  Register.ResponseData,
  Register.ResponseErrorTypes
>(Register.endpoint, Register.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  Register.ResponseData,
  Register.ResponseErrorTypes
>;

export * from '../Types/EndpointsApi/register';
