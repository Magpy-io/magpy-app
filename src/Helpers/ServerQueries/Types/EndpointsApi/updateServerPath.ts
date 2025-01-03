

import {
  ErrorPathAccessDenied,
  ErrorPathFolderDoesNotExist,
  ErrorCouldNotGetRequestAddress,
  ErrorAuthorizationFailed,
  ErrorPathNotAbsolute,
} from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;



export type ResponseErrorTypes =
  | ErrorAuthorizationFailed
  | ErrorPathFolderDoesNotExist
  | ErrorPathAccessDenied
  | ErrorCouldNotGetRequestAddress
  | ErrorPathNotAbsolute;

export const endpoint = 'updateServerPath';

export const tokenAuth: TokenAuthentification = 'optional';

//auto-generated file using "yarn types"
export * from '../RequestTypes/updateServerPath';
