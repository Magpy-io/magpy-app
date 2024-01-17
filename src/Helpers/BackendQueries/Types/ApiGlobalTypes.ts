import { ErrorBadRequest, ErrorServerError } from "./ErrorTypes";

export type ServerResponseData<T> = {
  ok: true;
  data: T;
};

export type ServerResponseError<Errors> = {
  ok: false;
  message: string;
  errorCode: Errors | ErrorBadRequest | ErrorServerError;
};

export type EndpointMethodsResponseType<T, U> = T | ServerResponseError<U>;

export type ResponseTypeFrom<DataType, ErrorTypes> =
  EndpointMethodsResponseType<ServerResponseData<DataType>, ErrorTypes>;
