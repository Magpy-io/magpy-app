import {
  ErrorAuthorizationBackendExpired,
  ErrorAuthorizationBackendFailed,
  ErrorBackendServerUnreachable,
  ErrorServerAlreadyClaimed,
} from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;

export type ResponseErrorTypes =
  | ErrorBackendServerUnreachable
  | ErrorServerAlreadyClaimed
  | ErrorAuthorizationBackendFailed
  | ErrorAuthorizationBackendExpired;

export const endpoint = 'claimServer';

export const tokenAuth: TokenAuthentification = 'no';

//auto-generated file using "yarn types"
export * from '../RequestTypes/claimServer';
