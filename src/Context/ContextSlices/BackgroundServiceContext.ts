import { useCallback, useEffect } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

import { GetPhotosById } from '~/Helpers/ServerQueries';
import { NativeEventsNames } from '~/NativeModules/NativeModulesEventNames';

import { ParseApiPhoto } from '../ReduxStore/Slices/Functions';
import { addPhotoFromLocalToServer } from '../ReduxStore/Slices/Photos';
import { useAppDispatch } from '../ReduxStore/Store';

const { MainModule } = NativeModules;

const intervalTimer = 500;

export function useBackgroundServiceEffects() {
  const dispatch = useAppDispatch();

  const manageBackgroundService = useCallback(async () => {
    const serviceState = await MainModule.getServiceState();

    if (serviceState == 'DESTROYED' || serviceState == 'STARTUP') {
      return;
    }

    if (serviceState == 'INACTIVE' || serviceState == 'FAILED') {
      if (serviceState == 'FAILED') {
        //TODO display toast message
      }

      await MainModule.stopSendingMediaService();
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      manageBackgroundService().catch(console.log);
    }, intervalTimer);

    return () => {
      clearInterval(intervalId);
    };
  }, [manageBackgroundService]);

  useEffect(() => {
    const emitter = new NativeEventEmitter();
    const subscription = emitter.addListener(
      NativeEventsNames.PhotoUploaded,
      ({ serverId, mediaId }: { serverId: string; mediaId: string; state: string }) => {
        async function core() {
          const ret = await GetPhotosById.Post({
            ids: [serverId],
            photoType: 'data',
          });

          if (!ret.ok || !ret.data.photos[0].exists) {
            console.log('photo just added but not found on server,', serverId);
            return;
          }

          dispatch(
            addPhotoFromLocalToServer({
              photoServer: ParseApiPhoto(ret.data.photos[0].photo),
              mediaId,
            }),
          );
        }

        core().catch(console.log);
      },
    );

    return () => {
      subscription.remove();
    };
  }, [dispatch]);
}
