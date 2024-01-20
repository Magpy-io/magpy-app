import { ErrorServerNotClaimed, ErrorsAuthorization } from '../ErrorTypes';
import { APIPhoto, PhotoTypesArray, TokenAuthentification } from '../Types';

export type ResponseData = {
  number: number;
  photos: Array<
    { path: string; exists: false } | { path: string; exists: true; photo: APIPhoto }
  >;
};

export type ResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export const endpoint = 'getPhotosByPath';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/getPhotosByPath';
