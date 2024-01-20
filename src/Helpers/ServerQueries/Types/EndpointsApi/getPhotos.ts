import { ErrorServerNotClaimed, ErrorsAuthorization } from '../ErrorTypes';
import { APIPhoto, PhotoTypesArray, TokenAuthentification } from '../Types';

export type ResponseData = {
  endReached: boolean;
  number: number;
  photos: APIPhoto[];
};

export type ResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export const endpoint = 'getPhotos';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/getPhotos';
