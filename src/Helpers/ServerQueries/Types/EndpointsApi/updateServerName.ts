

import {
  ErrorBackendServerUnreachable,
  ErrorInvalidName,
  ErrorCouldNotGetRequestAddress,
  ErrorAuthorizationFailed,
} from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;



export type ResponseErrorTypes =
  | ErrorAuthorizationFailed
  | ErrorInvalidName
  | ErrorCouldNotGetRequestAddress
  | ErrorBackendServerUnreachable;

export const endpoint = 'updateServerName';

export const tokenAuth: TokenAuthentification = 'no';

//auto-generated file using "yarn types"
export * from '../RequestTypes/updateServerName';
