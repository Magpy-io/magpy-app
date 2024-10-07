

import { ErrorServerNotClaimed, ErrorsAuthorization } from '../ErrorTypes';
import { APIPhoto, TokenAuthentification } from '../Types';

export type ResponseData = {
  photo: APIPhoto;
  photoExistsBefore: boolean;
};



export type ResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export const endpoint = 'addPhoto';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/addPhoto';
