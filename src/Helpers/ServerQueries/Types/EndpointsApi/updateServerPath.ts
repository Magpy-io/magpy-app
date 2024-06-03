

import {
  ErrorPathAccessDenied,
  ErrorPathFolderDoesNotExist,
  ErrorsNotFromLocal,
} from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;



export type ResponseErrorTypes =
  | ErrorPathFolderDoesNotExist
  | ErrorPathAccessDenied
  | ErrorsNotFromLocal;

export const endpoint = 'updateServerPath';

export const tokenAuth: TokenAuthentification = 'no';

//auto-generated file using "yarn types"
export * from '../RequestTypes/updateServerPath';
