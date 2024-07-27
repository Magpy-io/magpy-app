

import { ErrorsAuthorization } from '../ErrorTypes';
import { ServerType, TokenAuthentification } from '../Types';

export type ResponseData = {
  server: ServerType;
};



export type ResponseErrorTypes = ErrorsAuthorization;

export const endpoint = 'getServerInfo';

export const tokenAuth: TokenAuthentification = 'server';

//auto-generated file using "yarn types"
export * from '../RequestTypes/getServerInfo';
