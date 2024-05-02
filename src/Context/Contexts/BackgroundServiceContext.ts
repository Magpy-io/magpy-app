import { useEffect } from 'react';

import { GetPhotosById } from '~/Helpers/ServerQueries';
import { NativeEventEmitterWrapper } from '~/NativeModules/NativeModulesEventNames';

import { ParseApiPhoto } from '../ReduxStore/Slices/Photos/Functions';
import { addPhotoFromLocalToServer } from '../ReduxStore/Slices/Photos/Photos';
import { useAppDispatch } from '../ReduxStore/Store';

//const { MainModule } = NativeModules;

//const intervalTimer = 100;

export function useBackgroundServiceEffects() {
  const dispatch = useAppDispatch();

  // const manageBackgroundService = useCallback(async () => {
  //   const serviceState = await MainModule.getServiceState();

  //   if (serviceState == 'FAILED') {
  //     //TODO display toast message
  //     await MainModule.stopSendingMediaService();
  //   }
  // }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     manageBackgroundService().catch(console.log);
  //   }, intervalTimer);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [manageBackgroundService]);

  useEffect(() => {
    const emitter = new NativeEventEmitterWrapper();
    const subscription = emitter.subscribeOnPhotoUploaded(({ serverId, mediaId }) => {
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
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch]);
}
