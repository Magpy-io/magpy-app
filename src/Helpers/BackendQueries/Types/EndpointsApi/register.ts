

import {
  ErrorEmailTaken,
  ErrorInvalidEmail,
  ErrorInvalidName,
  ErrorInvalidPassword,
} from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;



export type ResponseErrorTypes =
  | ErrorEmailTaken
  | ErrorInvalidEmail
  | ErrorInvalidName
  | ErrorInvalidPassword;

export const endpoint = 'register';

export const tokenAuth: TokenAuthentification = 'no';

//auto-generated file using "yarn types"
export * from '../RequestTypes/register';
