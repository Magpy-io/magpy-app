import React, { ReactNode, useEffect } from 'react';

import { ParseApiPhoto } from '~/Context/ReduxStore/Slices/Photos/Functions';
import { addPhotoFromLocalToServer } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useAppDispatch } from '~/Context/ReduxStore/Store';
import { GetPhotosById } from '~/Helpers/ServerQueries';
import { NativeEventEmitterWrapper } from '~/NativeModules/NativeModulesEventNames';

type PropsType = {
  children: ReactNode;
};

export const BackgroundServiceEffects: React.FC<PropsType> = props => {
  const dispatch = useAppDispatch();

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

  return props.children;
};
