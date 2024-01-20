import {
  ErrorInvalidIpAddress,
  ErrorInvalidPort,
  ErrorInvalidServerName,
  ErrorsAuthorization,
} from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;

export type ResponseErrorTypes =
  | ErrorInvalidIpAddress
  | ErrorInvalidServerName
  | ErrorsAuthorization
  | ErrorInvalidPort;

export const endpoint = 'updateServerData';

export const tokenAuth: TokenAuthentification = 'server';

//auto-generated file using "yarn types"
export * from '../RequestTypes/updateServerData';
