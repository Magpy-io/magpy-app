

import { ErrorServerAlreadyClaimed } from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;



export type ResponseErrorTypes = ErrorServerAlreadyClaimed;

export const endpoint = 'claimServerLocal';

export const tokenAuth: TokenAuthentification = 'no';

//auto-generated file using "yarn types"
export * from '../RequestTypes/claimServerLocal';
