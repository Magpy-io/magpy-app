

import {
  ErrorIdNotFound,
  ErrorInvalidPartNumber,
  ErrorServerNotClaimed,
  ErrorsAuthorization,
} from '../ErrorTypes';
import { APIPhoto, TokenAuthentification } from '../Types';

export type ResponseData = {
  photo: APIPhoto;
  part: number;
  totalNbOfParts: number;
};



export type ResponseErrorTypes =
  | ErrorInvalidPartNumber
  | ErrorIdNotFound
  | ErrorServerNotClaimed
  | ErrorsAuthorization;

export const endpoint = 'getPhotoPartById';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/getPhotoPartById';
