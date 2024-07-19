import React, { ReactNode, useEffect } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { ParseApiPhoto } from '~/Context/ReduxStore/Slices/Photos/Functions';
import { addPhotoFromLocalToServer } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useAppDispatch } from '~/Context/ReduxStore/Store';
import { GetPhotosByMediaId } from '~/Helpers/ServerQueries';
import { NativeEventEmitterWrapper } from '~/NativeModules/NativeModulesEventNames';

type PropsType = {
  children: ReactNode;
};

export const BackgroundServiceEffects: React.FC<PropsType> = props => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const emitter = new NativeEventEmitterWrapper();
    const subscription = emitter.subscribeOnPhotoUploaded(({ mediaId }) => {
      async function core() {
        const ret = await GetPhotosByMediaId.Post({
          photosData: [{ mediaId: mediaId }],
          photoType: 'data',
          deviceUniqueId: uniqueDeviceId,
        });

        if (!ret.ok || !ret.data.photos[0].exists) {
          console.log('photo just added but not found on server, mediaId: ', mediaId);
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

  return props.children;
};
