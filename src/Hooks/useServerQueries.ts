import { useCallback } from 'react';

import { useServerContextFunctions } from '~/Context/Contexts/ServerContext';
import { GetPhotosById } from '~/Helpers/ServerQueries';
import { ErrorServerUnreachable } from '~/Helpers/ServerQueries/ExceptionsManager';
import { ErrorCodes } from '~/Helpers/ServerQueries/Types/ErrorTypes';

function isAuthError(errorCode: ErrorCodes) {
  return (
    errorCode == 'AUTHORIZATION_EXPIRED' ||
    errorCode == 'AUTHORIZATION_FAILED' ||
    errorCode == 'SERVER_NOT_CLAIMED'
  );
}

export function useServerQueries() {
  const { setServerNotReachable } = useServerContextFunctions();

  const GetPhotosByIdPost = useCallback(
    async (data: GetPhotosById.RequestData) => {
      try {
        const ret = await GetPhotosById.Post(data);

        if (!ret.ok && isAuthError(ret.errorCode)) {
          setServerNotReachable();
        }

        return ret;
      } catch (err) {
        if (err instanceof ErrorServerUnreachable) {
          setServerNotReachable();
        }
        throw err;
      }
    },
    [setServerNotReachable],
  );

  return { GetPhotosByIdPost };
}
