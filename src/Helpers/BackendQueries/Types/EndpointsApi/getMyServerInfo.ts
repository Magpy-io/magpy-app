import { ErrorNoAssociatedServer, ErrorsAuthorization } from '../ErrorTypes';
import { ServerType, TokenAuthentification } from '../Types';

export type ResponseData = {
  server: ServerType;
};

export type ResponseErrorTypes = ErrorNoAssociatedServer | ErrorsAuthorization;

export const endpoint = 'getMyServerInfo';

export const tokenAuth: TokenAuthentification = 'user';

//auto-generated file using "yarn types"
export * from '../RequestTypes/getMyServerInfo';
