import Joi from 'joi';

import { ErrorBackendServerUnreachable, ErrorsNotFromLocal } from '../ErrorTypes';
import { TokenAuthentification } from '../Types';

export type ResponseData = {
  storagePath: string;
  serverName: string;
  owner: { name: string; email: string } | null;
};

export const RequestSchema = Joi.object()
  .options({
    presence: 'required',
  })
  .meta({ className: 'RequestData' });

export type ResponseErrorTypes = ErrorsNotFromLocal | ErrorBackendServerUnreachable;

export const endpoint = 'getServerInfo';

export const tokenAuth: TokenAuthentification = 'no';

//auto-generated file using "yarn types"
export * from '../RequestTypes/getServerInfo';
