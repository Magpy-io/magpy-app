import { useCallback } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { UploadMediaModule } from '~/NativeModules/UploadMediaModule';

import { useServerContext } from '../ServerContext';

export function useUploadWorkerFunctions() {
  const { serverPath, token } = useServerContext();

  const UploadPhotosWorker = useCallback(
    async (mediaIds: string[]) => {
      await UploadMediaModule.StartUploadWorker({
        url: serverPath ?? '',
        deviceId: uniqueDeviceId,
        serverToken: token ?? '',
        photosIds: mediaIds,
      });
    },
    [serverPath, token],
  );

  return { UploadPhotosWorker };
}
