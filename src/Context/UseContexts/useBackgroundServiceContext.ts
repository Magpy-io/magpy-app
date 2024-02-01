import { useCallback } from 'react';
import { NativeModules } from 'react-native';

const { MainModule } = NativeModules;

export function useBackgroundServiceFunctions() {
  const SendPhotoToBackgroundServiceForUpload = useCallback(
    async (photoMediaIds: string[]) => {
      try {
        await MainModule.startSendingMediaService(photoMediaIds);
      } catch (err) {
        console.log(err);
      }
    },
    [],
  );

  return { SendPhotoToBackgroundServiceForUpload };
}

export function useBackgroundServiceContext() {}
