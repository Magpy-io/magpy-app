

import { ErrorPhotoExists, ErrorServerNotClaimed, ErrorsAuthorization } from '../ErrorTypes';
import { APIPhoto, TokenAuthentification } from '../Types';

export type ResponseData = {
  photo: APIPhoto;
};



export type ResponseErrorTypes =
  | ErrorServerNotClaimed
  | ErrorsAuthorization
  | ErrorPhotoExists;

export const endpoint = 'addPhoto';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/addPhoto';
