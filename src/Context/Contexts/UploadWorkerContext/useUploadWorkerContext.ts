import { useCallback } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { UploadMediaModule } from '~/NativeModules/UploadMediaModule';

import { useServerContext } from '../ServerContext';
import { useUploadWorkerContext } from './UploadWorkerContext';

export function useUploadWorkerFunctions() {
  const { setPhotosUploaded } = useUploadWorkerContext();
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

  const photosUploadedShift = useCallback(
    (nb: number = 1) => {
      setPhotosUploaded(curretPhotosUploaded => {
        if (curretPhotosUploaded.length <= nb) {
          return [];
        }

        return curretPhotosUploaded.slice(nb);
      });
    },
    [setPhotosUploaded],
  );

  const photosUploadedPush = useCallback(
    (mediaId: string) => {
      setPhotosUploaded(currentPhotosUploaded => {
        return [...currentPhotosUploaded, mediaId];
      });
    },
    [setPhotosUploaded],
  );

  return { UploadPhotosWorker, photosUploadedShift, photosUploadedPush };
}
