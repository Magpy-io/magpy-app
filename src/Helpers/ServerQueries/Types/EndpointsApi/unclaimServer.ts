

import {
  ErrorAuthorizationFailed,
  ErrorBackendServerUnreachable,
  ErrorCouldNotGetRequestAddress,
} from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;



export type ResponseErrorTypes =
  | ErrorAuthorizationFailed
  | ErrorCouldNotGetRequestAddress
  | ErrorBackendServerUnreachable;

export const endpoint = 'unclaimServer';

export const tokenAuth: TokenAuthentification = 'optional';

//auto-generated file using "yarn types"
export * from '../RequestTypes/unclaimServer';
