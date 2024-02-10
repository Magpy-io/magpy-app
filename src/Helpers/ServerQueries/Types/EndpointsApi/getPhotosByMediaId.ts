import { ErrorServerNotClaimed, ErrorsAuthorization } from '../ErrorTypes';
import { APIPhoto, PhotoTypesArray, TokenAuthentification } from '../Types';

export type ResponseData = {
  number: number;
  photos: Array<
    { mediaId: string; exists: false } | { mediaId: string; exists: true; photo: APIPhoto }
  >;
};

export type ResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export const endpoint = 'getPhotosByMediaId';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/getPhotosByMediaId';
