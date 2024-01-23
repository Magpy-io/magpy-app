import React, { useCallback, useEffect, useRef } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

import { PhotoType } from '~/Helpers/types';

import { useMainContext } from './MainContextProvider';
import { Actions } from './PhotosContext/PhotosReducer';

const { MainModule } = NativeModules;

const intervalTimer = 5000;

export type BackgroundServiceDataType = {
  refreshPhotosAddingServerIsRunning: React.MutableRefObject<boolean>;
};

export function useBackgroundServiceData(): BackgroundServiceDataType {
  const refreshPhotosAddingServerIsRunning = useRef(false);

  return { refreshPhotosAddingServerIsRunning };
}

export function useBackgroundServiceEffects() {
  const { backgroundServiceData, photosData } = useMainContext();
  const { photosDispatch } = photosData;
  const { refreshPhotosAddingServerIsRunning } = backgroundServiceData;

  const refreshPhotosAddingServer = useCallback(async () => {
    try {
      if (refreshPhotosAddingServerIsRunning.current) {
        // already refreshing
        return;
      }

      refreshPhotosAddingServerIsRunning.current = true;

      const serviceState = await MainModule.getServiceState();

      if (serviceState == 'DESTROYED' || serviceState == 'STARTUP') {
        return;
      }

      const ids = await MainModule.getIds();
      const currentIndex = await MainModule.getCurrentIndex();

      photosDispatch({
        type: Actions.updatePhotosFromService,
        payload: { ids, currentIndex },
      });

      if (serviceState == 'INACTIVE' || serviceState == 'FAILED') {
        await MainModule.stopSendingMediaService();
        photosDispatch({
          type: Actions.clearAllLoadingLocal,
          payload: {},
        });

        if (serviceState == 'FAILED') {
          //TODO display toast message
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      refreshPhotosAddingServerIsRunning.current = false;
    }
  }, [refreshPhotosAddingServerIsRunning, photosDispatch]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshPhotosAddingServer().catch(console.log);
    }, intervalTimer);

    return () => {
      clearInterval(intervalId);
    };
  }, [refreshPhotosAddingServer]);

  useEffect(() => {
    const emitter = new NativeEventEmitter();
    const subscription = emitter.addListener('PhotoUploaded', () => {
      refreshPhotosAddingServer?.().catch(console.log);
    });

    return () => {
      subscription.remove();
    };
  }, [refreshPhotosAddingServer]);
}

export function useBackgroundService() {
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

  return { SendPhotoToBackgroundServiceForUpload };
}
