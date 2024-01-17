import { AddPhotoPart } from "../Types/";
import { GeneratePostRequest } from "../RequestsManager";
import { ResponseTypeFrom } from "../Types/ApiGlobalTypes";

export const Post = GeneratePostRequest<
  AddPhotoPart.RequestData,
  AddPhotoPart.ResponseData,
  AddPhotoPart.ResponseErrorTypes
>(AddPhotoPart.endpoint, AddPhotoPart.tokenAuth);

export type ResponseType = ResponseTypeFrom<
  AddPhotoPart.ResponseData,
  AddPhotoPart.ResponseErrorTypes
>;

export * from "../Types/EndpointsApi/addPhotoPart";
