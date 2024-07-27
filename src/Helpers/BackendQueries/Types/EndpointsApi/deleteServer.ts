

import { ErrorsAuthorization } from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;



export type ResponseErrorTypes = ErrorsAuthorization;

export const endpoint = 'deleteServer';

export const tokenAuth: TokenAuthentification = 'server';

//auto-generated file using "yarn types"
export * from '../RequestTypes/deleteServer';
