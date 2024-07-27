

import {
  ErrorAuthorizationFailed,
  ErrorBackendServerUnreachable,
  ErrorCouldNotGetRequestAddress,
} from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = {
  storagePath: string;
  serverName: string;
  owner: { name: string; email: string } | null;
  ownerLocal: { name: string } | null;
};



export type ResponseErrorTypes =
  | ErrorAuthorizationFailed
  | ErrorCouldNotGetRequestAddress
  | ErrorBackendServerUnreachable;

export const endpoint = 'getServerInfo';

export const tokenAuth: TokenAuthentification = 'optional';

//auto-generated file using "yarn types"
export * from '../RequestTypes/getServerInfo';
