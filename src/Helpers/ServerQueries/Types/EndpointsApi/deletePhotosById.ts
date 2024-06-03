

import { ErrorServerNotClaimed, ErrorsAuthorization } from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = {
  deletedIds: string[];
};



export type ResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export const endpoint = 'deletePhotosById';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/deletePhotosById';
