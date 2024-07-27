

import { ErrorIdNotFound, ErrorServerNotClaimed, ErrorsAuthorization } from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;



export type ResponseErrorTypes = ErrorIdNotFound | ErrorServerNotClaimed | ErrorsAuthorization;

export const endpoint = 'updatePhotoMediaId';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/updatePhotoMediaId';
