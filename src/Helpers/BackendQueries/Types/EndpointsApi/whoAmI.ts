

import { ErrorsAuthorization } from '../ErrorTypes';
import { TokenAuthentification, UserType } from '../Types';

export type ResponseData = {
  user: UserType;
};



export type ResponseErrorTypes = ErrorsAuthorization;

export const endpoint = 'whoAmI';

export const tokenAuth: TokenAuthentification = 'user';

//auto-generated file using "yarn types"
export * from '../RequestTypes/whoAmI';
