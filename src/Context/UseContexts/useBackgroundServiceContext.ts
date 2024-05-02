import { useCallback } from 'react';

import { SendingMediaServiceModule } from '~/NativeModules/SendingMediaServiceModule';

import { PhotoLocalType } from '../ReduxStore/Slices/Photos/Photos';

export function useBackgroundServiceFunctions() {
  const SendPhotoToBackgroundServiceForUpload = useCallback(
    async (photos: PhotoLocalType[]) => {
      await SendingMediaServiceModule.startSendingMediaService(
        photos.map(p => ({
          id: p.id,
        })),
      );
    },
    [],
  );

  return { SendPhotoToBackgroundServiceForUpload };
}

export function useBackgroundServiceContext() {}
