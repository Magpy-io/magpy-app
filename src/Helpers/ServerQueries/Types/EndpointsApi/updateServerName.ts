

import {
  ErrorBackendServerUnreachable,
  ErrorInvalidName,
  ErrorsNotFromLocal,
} from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;



export type ResponseErrorTypes =
  | ErrorInvalidName
  | ErrorsNotFromLocal
  | ErrorBackendServerUnreachable;

export const endpoint = 'updateServerName';

export const tokenAuth: TokenAuthentification = 'no';

//auto-generated file using "yarn types"
export * from '../RequestTypes/updateServerName';
