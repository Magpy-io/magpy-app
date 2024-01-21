import React, { useCallback, useEffect, useRef } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

import { Actions } from '~/Context/ContextReducer';
import { PhotoType } from '~/Helpers/types';

import { useMainContext } from './ContextProvider';

const { MainModule } = NativeModules;

const intervalTimer = 5000;

export type BackgroundServiceDataType = {
  isrefreshPhotosAddingServerRunning: React.MutableRefObject<boolean>;
  intervalIdForRefreshPhotosAddingServer: React.MutableRefObject<
    ReturnType<typeof setInterval> | undefined
  >;
};

export function useBackgroundServiceData(): BackgroundServiceDataType {
  const isrefreshPhotosAddingServerRunning = useRef(false);
  const intervalIdForRefreshPhotosAddingServer = useRef<ReturnType<typeof setInterval>>();

  return { isrefreshPhotosAddingServerRunning, intervalIdForRefreshPhotosAddingServer };
}

export function useBackgroundServiceEffects() {
  const { backgroundServiceData } = useMainContext();
  const { intervalIdForRefreshPhotosAddingServer } = backgroundServiceData;

  const { refreshPhotosAddingServer } = useBackgroundService();

  const intervalFunction = useCallback(() => {
    refreshPhotosAddingServer?.().catch(console.log);
  }, [refreshPhotosAddingServer]);

  useEffect(() => {
    intervalIdForRefreshPhotosAddingServer.current = setInterval(
      intervalFunction,
      intervalTimer,
    );

    return () => {
      clearInterval(intervalIdForRefreshPhotosAddingServer.current);
    };
  }, [intervalFunction, intervalIdForRefreshPhotosAddingServer]);

  useEffect(() => {
    const emitter = new NativeEventEmitter();
    const subscription = emitter.addListener('PhotoUploaded', () => {
      console.log('event');
      refreshPhotosAddingServer?.().catch(console.log);

      if (intervalIdForRefreshPhotosAddingServer.current != null) {
        clearInterval(intervalIdForRefreshPhotosAddingServer.current);
        intervalIdForRefreshPhotosAddingServer.current = setInterval(
          intervalFunction,
          intervalTimer,
        );
      }
    });

    return () => {
      subscription.remove();
    };
  }, [intervalFunction, intervalIdForRefreshPhotosAddingServer, refreshPhotosAddingServer]);
}

export function useBackgroundService() {
  const { backgroundServiceData, photosDispatch } = useMainContext();

  const { isrefreshPhotosAddingServerRunning } = backgroundServiceData;

  const refreshPhotosAddingServer = useCallback(async () => {
    try {
      if (isrefreshPhotosAddingServerRunning.current) {
        return;
      }

      isrefreshPhotosAddingServerRunning.current = true;

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
      isrefreshPhotosAddingServerRunning.current = false;
    }
  }, [isrefreshPhotosAddingServerRunning, photosDispatch]);

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

  return { refreshPhotosAddingServer, SendPhotoToBackgroundServiceForUpload };
}
