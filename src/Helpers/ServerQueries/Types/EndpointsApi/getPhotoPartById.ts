import Joi from 'joi';

import {
  ErrorIdNotFound,
  ErrorInvalidPartNumber,
  ErrorServerNotClaimed,
  ErrorsAuthorization,
} from '../ErrorTypes';
import { APIPhoto, TokenAuthentification } from '../Types';

export type ResponseData = {
  photo: APIPhoto;
  part: number;
  totalNbOfParts: number;
};

export const RequestSchema = Joi.object({
  id: Joi.string().uuid({
    version: 'uuidv4',
  }),
  part: Joi.number().integer(),
})
  .options({ presence: 'required' })
  .meta({ className: 'RequestData' });

export type ResponseErrorTypes =
  | ErrorInvalidPartNumber
  | ErrorIdNotFound
  | ErrorServerNotClaimed
  | ErrorsAuthorization;

export const endpoint = 'getPhotoPartById';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/getPhotoPartById';
