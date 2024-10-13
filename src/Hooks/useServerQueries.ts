import { useMemo } from 'react';

import { useServerContextFunctions } from '~/Context/Contexts/ServerContext';
import { GetPhotosById, GetServerInfo } from '~/Helpers/ServerQueries';
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

  type ResponseTypeGeneric = { ok: true } | { ok: false; errorCode: ErrorCodes };

  function transformFunction<RequestData, ResponseType extends ResponseTypeGeneric>(
    f: (data: RequestData) => Promise<ResponseType>,
  ) {
    return async (data: RequestData) => {
      try {
        const ret = await f(data);

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
    };
  }

  return useMemo(() => {
    return {
      GetPhotosByIdPost: transformFunction(GetPhotosById.Post),
      GetServerInfoPost: transformFunction(GetServerInfo.Post),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setServerNotReachable]);
}
