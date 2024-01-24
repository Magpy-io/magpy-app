import React, { useCallback, useEffect, useRef } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

import { useMainContext } from '../MainContextProvider';

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
  const { backgroundServiceData } = useMainContext();

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

      //const ids = await MainModule.getIds();
      //const currentIndex = await MainModule.getCurrentIndex();

      if (serviceState == 'INACTIVE' || serviceState == 'FAILED') {
        await MainModule.stopSendingMediaService();

        if (serviceState == 'FAILED') {
          //TODO display toast message
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      refreshPhotosAddingServerIsRunning.current = false;
    }
  }, [refreshPhotosAddingServerIsRunning]);

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
