import Joi from 'joi';

import {
  ErrorPathAccessDenied,
  ErrorPathFolderDoesNotExist,
  ErrorsNotFromLocal,
} from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = string;

export const RequestSchema = Joi.object({
  path: Joi.string().optional(),
})
  .options({ presence: 'required' })
  .meta({ className: 'RequestData' });

export type ResponseErrorTypes =
  | ErrorPathFolderDoesNotExist
  | ErrorPathAccessDenied
  | ErrorsNotFromLocal;

export const endpoint = 'updateServerPath';

export const tokenAuth: TokenAuthentification = 'no';

//auto-generated file using "yarn types"
export * from '../RequestTypes/updateServerPath';
