

import { ErrorServerNotClaimed, ErrorsAuthorization } from '../ErrorTypes';
import { TokenAuthentification } from '../Types';
import { WarningDataTypes } from '../WarningTypes';

export type ResponseData = {
  warning: WarningDataTypes | null;
};



export type ResponseErrorTypes = ErrorServerNotClaimed | ErrorsAuthorization;

export const endpoint = 'getLastWarning';

export const tokenAuth: TokenAuthentification = 'yes';

//auto-generated file using "yarn types"
export * from '../RequestTypes/getLastWarning';
