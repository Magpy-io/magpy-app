

import {
  ErrorPathAccessDenied,
  ErrorPathFolderDoesNotExist,
  ErrorCouldNotGetRequestAddress,
  ErrorAuthorizationFailed,
} from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;



export type ResponseErrorTypes =
  | ErrorAuthorizationFailed
  | ErrorPathFolderDoesNotExist
  | ErrorPathAccessDenied
  | ErrorCouldNotGetRequestAddress;

export const endpoint = 'updateServerPath';

export const tokenAuth: TokenAuthentification = 'no';

//auto-generated file using "yarn types"
export * from '../RequestTypes/updateServerPath';
