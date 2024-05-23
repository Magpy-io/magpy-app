

import { ErrorBackendServerUnreachable, ErrorsNotFromLocal } from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;



export type ResponseErrorTypes = ErrorsNotFromLocal | ErrorBackendServerUnreachable;

export const endpoint = 'unclaimServer';

export const tokenAuth: TokenAuthentification = 'no';

//auto-generated file using "yarn types"
export * from '../RequestTypes/unclaimServer';
