import { useMemo } from 'react';

import { useServerContextFunctions } from '~/Context/Contexts/ServerContext';
import {
  GetPhotoPartById,
  GetPhotos,
  GetPhotosById,
  GetPhotosByMediaId,
  GetServerInfo,
  UpdatePhotoMediaId,
} from '~/Helpers/ServerQueries';
import { ErrorServerUnreachable } from '~/Helpers/ServerQueries/ExceptionsManager';
import { ErrorCodes } from '~/Helpers/ServerQueries/Types/ErrorTypes';

type ResponseTypeGeneric = { ok: true } | { ok: false; errorCode: ErrorCodes };

function isAuthError(errorCode: ErrorCodes) {
  return (
    errorCode == 'AUTHORIZATION_EXPIRED' ||
    errorCode == 'AUTHORIZATION_FAILED' ||
    errorCode == 'SERVER_NOT_CLAIMED'
  );
}

export function useServerQueries() {
  const { setServerNotReachable } = useServerContextFunctions();

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
      GetPhotosByMediaIdPost: transformFunction(GetPhotosByMediaId.Post),
      GetServerInfoPost: transformFunction(GetServerInfo.Post),
      GetPhotosPost: transformFunction(GetPhotos.Post),
      GetPhotoPartByIdPost: transformFunction(GetPhotoPartById.Post),
      UpdatePhotoMediaIdPost: transformFunction(UpdatePhotoMediaId.Post),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setServerNotReachable]);
}
