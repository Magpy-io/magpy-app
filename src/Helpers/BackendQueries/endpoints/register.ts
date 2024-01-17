import { Register } from "../Types/";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";
import { GeneratePostRequest } from "../RequestsManager";

export const Post = GeneratePostRequest<
  Register.RequestData,
  Register.ResponseData,
  Register.ResponseErrorTypes
>(Register.endpoint, Register.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  Register.ResponseData,
  Register.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/register";
