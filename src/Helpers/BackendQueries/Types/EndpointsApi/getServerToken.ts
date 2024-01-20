import Joi from 'joi';

import { ErrorInvalidCredentials } from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;

export const RequestSchema = Joi.object({
  id: Joi.string(),
  key: Joi.string(),
})
  .options({
    presence: 'required',
  })
  .meta({ className: 'RequestData' });

export type ResponseErrorTypes = ErrorInvalidCredentials;

export const endpoint = 'getServerToken';

export const tokenAuth: TokenAuthentification = 'set-token-server';

//auto-generated file using "yarn types"
export * from '../RequestTypes/getServerToken';
