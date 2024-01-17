import axios from "axios";
import { handleAxiosError } from "./ExceptionsManager";
import { getPathWithEndpoint } from "./PathManager";
import {
  extractToken,
  serverAuthorizationObject,
  SetServerToken,
  SetUserToken,
  userAuthorizationObject,
  verifyHasServerToken,
  verifyHasUserToken,
} from "./TokenManager";
import { ResponseTypeFrom } from "./Types/ApiGlobalTypes";
import { TokenAuthentification } from "./Types/Types";

function GeneratePostWithUserAuth<
  RequestData,
  ResponseData,
  ResponseErrorTypes
>(endpointPath: string) {
  const PostFunction = async <RequestData, ResponseData, ResponseErrorTypes>(
    data: RequestData
  ): Promise<ResponseTypeFrom<ResponseData, ResponseErrorTypes>> => {
    verifyHasUserToken();
    try {
      const response = await axios.post(
        getPathWithEndpoint(endpointPath),
        data,
        userAuthorizationObject()
      );
      return response.data;
    } catch (err: any) {
      return handleAxiosError(err);
    }
  };
  return PostFunction;
}

function GeneratePostWithServerAuth<
  RequestData,
  ResponseData,
  ResponseErrorTypes
>(endpointPath: string) {
  const PostFunction = async <RequestData, ResponseData, ResponseErrorTypes>(
    data: RequestData
  ): Promise<ResponseTypeFrom<ResponseData, ResponseErrorTypes>> => {
    verifyHasServerToken();
    try {
      const response = await axios.post(
        getPathWithEndpoint(endpointPath),
        data,
        serverAuthorizationObject()
      );
      return response.data;
    } catch (err: any) {
      return handleAxiosError(err);
    }
  };
  return PostFunction;
}

function GeneratePostWithNoAuth<RequestData, ResponseData, ResponseErrorTypes>(
  endpointPath: string
) {
  const PostFunction = async <RequestData, ResponseData, ResponseErrorTypes>(
    data: RequestData
  ): Promise<ResponseTypeFrom<ResponseData, ResponseErrorTypes>> => {
    try {
      const response = await axios.post(
        getPathWithEndpoint(endpointPath),
        data
      );
      return response.data;
    } catch (err: any) {
      return handleAxiosError(err);
    }
  };
  return PostFunction;
}

function GeneratePostSetUserAuth<RequestData, ResponseData, ResponseErrorTypes>(
  endpointPath: string
) {
  const PostFunction = async <RequestData, ResponseData, ResponseErrorTypes>(
    data: RequestData
  ): Promise<ResponseTypeFrom<ResponseData, ResponseErrorTypes>> => {
    try {
      const response = await axios.post(
        getPathWithEndpoint(endpointPath),
        data
      );
      const token = extractToken(response);
      SetUserToken(token);
      return response.data;
    } catch (err: any) {
      return handleAxiosError(err);
    }
  };
  return PostFunction;
}

function GeneratePostSetServerAuth<
  RequestData,
  ResponseData,
  ResponseErrorTypes
>(endpointPath: string) {
  const PostFunction = async <RequestData, ResponseData, ResponseErrorTypes>(
    data: RequestData
  ): Promise<ResponseTypeFrom<ResponseData, ResponseErrorTypes>> => {
    try {
      const response = await axios.post(
        getPathWithEndpoint(endpointPath),
        data
      );
      const token = extractToken(response);
      SetServerToken(token);
      return response.data;
    } catch (err: any) {
      return handleAxiosError(err);
    }
  };
  return PostFunction;
}

type FunctionType<RequestData, ResponseData, ResponseErrorTypes> =
  {} extends RequestData
    ? (
        data?: RequestData
      ) => Promise<ResponseTypeFrom<ResponseData, ResponseErrorTypes>>
    : (
        data: RequestData
      ) => Promise<ResponseTypeFrom<ResponseData, ResponseErrorTypes>>;

export function GeneratePostRequest<
  RequestData,
  ResponseData,
  ResponseErrorTypes
>(
  endpointPath: string,
  tokenAuth: TokenAuthentification
): FunctionType<RequestData, ResponseData, ResponseErrorTypes> {
  switch (tokenAuth) {
    case "user":
      return GeneratePostWithUserAuth<
        RequestData,
        ResponseData,
        ResponseErrorTypes
      >(endpointPath);

    case "server":
      return GeneratePostWithServerAuth<
        RequestData,
        ResponseData,
        ResponseErrorTypes
      >(endpointPath);

    case "no":
      return GeneratePostWithNoAuth<
        RequestData,
        ResponseData,
        ResponseErrorTypes
      >(endpointPath);

    case "set-token-user":
      return GeneratePostSetUserAuth<
        RequestData,
        ResponseData,
        ResponseErrorTypes
      >(endpointPath);

    case "set-token-server":
      return GeneratePostSetServerAuth<
        RequestData,
        ResponseData,
        ResponseErrorTypes
      >(endpointPath);
  }
}
