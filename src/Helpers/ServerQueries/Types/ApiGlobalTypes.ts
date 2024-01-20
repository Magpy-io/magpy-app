import { ErrorBadRequest, ErrorServerError } from './ErrorTypes';

export type ServerResponseData<T> = {
  ok: true;
  data: T;
  warning: boolean;
};

export type ServerResponseError<Errors> = {
  ok: false;
  message: string;
  errorCode: Errors | ErrorBadRequest | ErrorServerError;
  warning: boolean;
};

export type EndpointMethodsResponseType<T, U> = T | ServerResponseError<U>;

export type ResponseTypeFrom<DataType, ErrorTypes> = EndpointMethodsResponseType<
  ServerResponseData<DataType>,
  ErrorTypes
>;
