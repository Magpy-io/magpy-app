

import {
  ErrorInvalidIpAddress,
  ErrorInvalidKeyFormat,
  ErrorInvalidPort,
  ErrorInvalidServerName,
  ErrorsAuthorization,
} from '../ErrorTypes';
import { ServerType, TokenAuthentification } from '../Types';

export type ResponseData = {
  server: ServerType;
};



export type ResponseErrorTypes =
  | ErrorInvalidIpAddress
  | ErrorInvalidServerName
  | ErrorInvalidKeyFormat
  | ErrorsAuthorization
  | ErrorInvalidPort;

export const endpoint = 'registerServer';

export const tokenAuth: TokenAuthentification = 'user';

//auto-generated file using "yarn types"
export * from '../RequestTypes/registerServer';
