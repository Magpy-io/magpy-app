

import { ErrorInvalidCredentials } from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;



export type ResponseErrorTypes = ErrorInvalidCredentials;

export const endpoint = 'getServerToken';

export const tokenAuth: TokenAuthentification = 'set-token-server';

//auto-generated file using "yarn types"
export * from '../RequestTypes/getServerToken';
