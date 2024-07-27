

import {
  ErrorMissingParts,
  ErrorPhotoExists,
  ErrorPhotoSizeExceeded,
  ErrorPhotoTransferNotFound,
  ErrorServerNotClaimed,
  ErrorsAuthorization,
} from '../ErrorTypes';
import { APIPhoto, TokenAuthentification } from '../Types';

export type ResponseData =
  | {
      lenReceived: number;
      lenWaiting: number;
      done: false;
    }
  | {
      lenReceived: number;
      lenWaiting: number;
      done: true;
      photo: APIPhoto;
    };



export type ResponseErrorTypes =
  | ErrorPhotoSizeExceeded
  | ErrorMissingParts
  | ErrorPhotoTransferNotFound
  | ErrorServerNotClaimed
  | ErrorsAuthorization
  | ErrorPhotoExists;

export const endpoint = 'addPhotoPart';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/addPhotoPart';
