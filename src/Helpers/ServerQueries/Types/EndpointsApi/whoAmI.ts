import { ErrorServerNotClaimed, ErrorsAuthorization } from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = {
  user: { id: string };
};

export type ResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export const endpoint = 'whoAmI';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/whoAmI';
