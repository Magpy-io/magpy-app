import { useCallback } from 'react';

import { PhotoLocalType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { SendingMediaServiceModule } from '~/NativeModules/SendingMediaServiceModule';

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
