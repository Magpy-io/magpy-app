import Joi from 'joi';

import { ErrorServerNotClaimed, ErrorsAuthorization } from '../ErrorTypes';
import { APIPhoto, TokenAuthentification } from '../Types';

export type ResponseData = {
  photo: APIPhoto;
};

export const RequestSchema = Joi.object({
  name: Joi.string(),
  fileSize: Joi.number().integer(),
  width: Joi.number().integer(),
  height: Joi.number().integer(),
  path: Joi.string(),
  date: Joi.string().isoDate(),
  image64: Joi.string().base64(),
  deviceUniqueId: Joi.string(),
})
  .options({ presence: 'required' })
  .meta({ className: 'RequestData' });

export type ResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export const endpoint = 'addPhoto';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/addPhoto';
