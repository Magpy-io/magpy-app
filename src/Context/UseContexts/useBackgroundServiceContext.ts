import { useCallback } from 'react';
import { NativeModules } from 'react-native';

import { PhotoLocalType } from '../ReduxStore/Slices/Photos';

const { MainModule } = NativeModules;

export function useBackgroundServiceFunctions() {
  const SendPhotoToBackgroundServiceForUpload = useCallback(
    async (photos: PhotoLocalType[]) => {
      try {
        await MainModule.startSendingMediaService(
          photos.map(p => {
            return {
              id: p.id,
              name: p.fileName,
              date: p.created,
              path: p.uri,
              width: p.width,
              height: p.height,
              size: p.fileSize,
            };
          }),
        );
      } catch (err) {
        console.log(err);
      }
    },
    [],
  );

  return { SendPhotoToBackgroundServiceForUpload };
}

export function useBackgroundServiceContext() {}
