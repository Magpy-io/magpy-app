

import { ErrorServerNotClaimed, ErrorsAuthorization } from '../ErrorTypes';
import { APIPhoto, TokenAuthentification } from '../Types';

export type ResponseData =
  | {
      id: string;
      photoExistsBefore: false;
    }
  | {
      photo: APIPhoto;
      photoExistsBefore: true;
    };



export type ResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export const endpoint = 'addPhotoInit';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/addPhotoInit';
