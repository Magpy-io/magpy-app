import { useCallback } from 'react';
import { NativeModules } from 'react-native';

import { useMainContext } from '~/Context/MainContextProvider';
import { PhotoType } from '~/Helpers/types';

const { MainModule } = NativeModules;

export function useBackgroundServiceFunctions() {
  const { backgroundServiceData } = useMainContext();

  const SendPhotoToBackgroundServiceForUpload = useCallback(async (photos: PhotoType[]) => {
    try {
      await MainModule.startSendingMediaService(
        photos.map(p => {
          return {
            id: p.id,
            name: p.image.fileName,
            date: new Date(p.created).toJSON(),
            path: p.image.path ?? '',
            width: p.image.width,
            height: p.image.height,
            size: p.image.fileSize,
          };
        }),
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  return { backgroundServiceData, SendPhotoToBackgroundServiceForUpload };
}

export function useBackgroundServiceContext() {
  const { backgroundServiceData } = useMainContext();

  return backgroundServiceData;
}
