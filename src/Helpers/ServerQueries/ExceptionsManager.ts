import { ServerResponseError } from './Types/ApiGlobalTypes';

export class ErrorBackendUnreachable extends Error {
  constructor() {
    super();
    this.message = 'Server is unreachable';
  }
}

export function handleAxiosError(err: any): ServerResponseError<any> {
  if (err.response) {
    return err.response.data;
  } else if (err.request) {
    throw new ErrorBackendUnreachable();
  } else {
    throw err;
  }
}
