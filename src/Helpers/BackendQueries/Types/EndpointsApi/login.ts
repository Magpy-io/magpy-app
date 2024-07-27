

import { ErrorInvalidCredentials } from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;



export type ResponseErrorTypes = ErrorInvalidCredentials;

export const endpoint = 'login';

export const tokenAuth: TokenAuthentification = 'set-token-user';

//auto-generated file using "yarn types"
export * from '../RequestTypes/login';
