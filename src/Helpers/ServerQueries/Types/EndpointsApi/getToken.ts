import Joi from 'joi';

import {
  ErrorAuthorizationBackendExpired,
  ErrorAuthorizationBackendFailed,
  ErrorBackendServerUnreachable,
  ErrorServerNotClaimed,
  ErrorUserNotAllowed,
} from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;

export const RequestSchema = Joi.object({
  userToken: Joi.string(),
})
  .options({ presence: 'required' })
  .meta({ className: 'RequestData' });

export type ResponseErrorTypes =
  | ErrorBackendServerUnreachable
  | ErrorServerNotClaimed
  | ErrorUserNotAllowed
  | ErrorAuthorizationBackendFailed
  | ErrorAuthorizationBackendExpired;

export const endpoint = 'getToken';

export const tokenAuth: TokenAuthentification = 'set-token';

//auto-generated file using "yarn types"
export * from '../RequestTypes/getToken';
