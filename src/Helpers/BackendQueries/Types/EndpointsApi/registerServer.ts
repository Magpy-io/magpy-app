import Joi from 'joi';

import {
  ErrorInvalidIpAddress,
  ErrorInvalidKeyFormat,
  ErrorInvalidPort,
  ErrorInvalidServerName,
  ErrorsAuthorization,
} from '../ErrorTypes';
import { ServerType, TokenAuthentification } from '../Types';

export type ResponseData = {
  server: ServerType;
};

export const RequestSchema = Joi.object({
  name: Joi.string(),
  ipAddressPublic: Joi.string(),
  ipAddressPrivate: Joi.string(),
  port: Joi.string(),
  serverKey: Joi.string(),
})
  .options({
    presence: 'required',
  })
  .meta({ className: 'RequestData' });

export type ResponseErrorTypes =
  | ErrorInvalidIpAddress
  | ErrorInvalidServerName
  | ErrorInvalidKeyFormat
  | ErrorsAuthorization
  | ErrorInvalidPort;

export const endpoint = 'registerServer';

export const tokenAuth: TokenAuthentification = 'user';

//auto-generated file using "yarn types"
export * from '../RequestTypes/registerServer';
