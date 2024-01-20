import Joi from 'joi';

import { ErrorServerNotClaimed, ErrorsAuthorization } from '../ErrorTypes';
import { APIPhoto, PhotoTypesArray, TokenAuthentification } from '../Types';

export type ResponseData = {
  number: number;
  photos: Array<{ id: string; exists: false } | { id: string; exists: true; photo: APIPhoto }>;
};

export const RequestSchema = Joi.object({
  ids: Joi.array().items(Joi.string().uuid({ version: 'uuidv4' })),
  photoType: Joi.string().valid(...PhotoTypesArray),
})
  .options({ presence: 'required' })
  .meta({ className: 'RequestData' });

export type ResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export const endpoint = 'getPhotosById';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/getPhotosById';
