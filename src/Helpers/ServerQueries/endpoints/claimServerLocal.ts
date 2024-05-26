import { GeneratePostRequest } from '../RequestsManager';
import { ClaimServerLocal } from '../Types/';
import { ResponseTypeFrom } from '../Types/ApiGlobalTypes';

export const Post = GeneratePostRequest<
  ClaimServerLocal.RequestData,
  ClaimServerLocal.ResponseData,
  ClaimServerLocal.ResponseErrorTypes
>(ClaimServerLocal.endpoint, ClaimServerLocal.tokenAuth);

export type ResponseType = ResponseTypeFrom<
ClaimServerLocal.ResponseData,
ClaimServerLocal.ResponseErrorTypes
>;

export * from '../Types/EndpointsApi/claimServerLocal';
