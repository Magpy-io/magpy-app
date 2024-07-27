

import { ErrorNoAssociatedServer, ErrorsAuthorization } from '../ErrorTypes';
import { ServerType, TokenAuthentification } from '../Types';

export type ResponseData = string;



export type ResponseErrorTypes = ErrorsAuthorization;

export const endpoint = 'deleteMyServer';

export const tokenAuth: TokenAuthentification = 'user';

//auto-generated file using "yarn types"
export * from '../RequestTypes/deleteMyServer';
