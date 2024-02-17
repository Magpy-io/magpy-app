import { useCallback } from 'react';
import { NativeModules } from 'react-native';

import { PhotoLocalType } from '../ReduxStore/Slices/Photos/Photos';

const { MainModule } = NativeModules;

export function useBackgroundServiceFunctions() {
  const SendPhotoToBackgroundServiceForUpload = useCallback(
    async (photos: PhotoLocalType[]) => {
      await MainModule.startSendingMediaService(
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
