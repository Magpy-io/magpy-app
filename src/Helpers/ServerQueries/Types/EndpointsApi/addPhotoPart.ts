import Joi from 'joi';

import {
  ErrorMissingParts,
  ErrorPhotoSizeExceeded,
  ErrorPhotoTransferNotFound,
  ErrorServerNotClaimed,
  ErrorsAuthorization,
} from '../ErrorTypes';
import { APIPhoto, TokenAuthentification } from '../Types';

export type ResponseData =
  | {
      lenReceived: number;
      lenWaiting: number;
      done: false;
    }
  | {
      lenReceived: number;
      lenWaiting: number;
      done: true;
      photo: APIPhoto;
    };

export const RequestSchema = Joi.object({
  id: Joi.string().uuid({
    version: 'uuidv4',
  }),
  partNumber: Joi.number().integer(),
  partSize: Joi.number().integer(),
  photoPart: Joi.string(),
})
  .options({ presence: 'required' })
  .meta({ className: 'RequestData' });

export type ResponseErrorTypes =
  | ErrorPhotoSizeExceeded
  | ErrorMissingParts
  | ErrorPhotoTransferNotFound
  | ErrorServerNotClaimed
  | ErrorsAuthorization;

export const endpoint = 'addPhotoPart';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/addPhotoPart';
