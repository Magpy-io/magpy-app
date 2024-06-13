

import { ErrorServerNotClaimed, ErrorsAuthorization } from '../ErrorTypes';
import { APIPhoto, TokenAuthentification } from '../Types';

export type ResponseData = { claimed: 'None' | 'Locally' | 'Remotely' };



export type ResponseErrorTypes = void;

export const endpoint = 'status';

export const tokenAuth: TokenAuthentification = 'no';

//auto-generated file using "yarn types"
export * from '../RequestTypes/status';
