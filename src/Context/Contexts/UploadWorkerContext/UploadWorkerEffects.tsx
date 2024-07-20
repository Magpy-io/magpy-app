import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { ParseApiPhoto } from '~/Context/ReduxStore/Slices/Photos/Functions';
import { addPhotosFromLocalToServer } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useAppDispatch } from '~/Context/ReduxStore/Store';
import { GetPhotosByMediaId } from '~/Helpers/ServerQueries';
import { NativeEventEmitterWrapper } from '~/NativeModules/NativeModulesEventNames';

type PropsType = {
  children: ReactNode;
};

export const UploadWorkerEffects: React.FC<PropsType> = props => {
  const dispatch = useAppDispatch();

  const photosUploadedRef = useRef<string[]>([]);

  const [rerunEffect, setRerunEffect] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRerunEffect(s => !s);
    }, 2000);

    const emitter = new NativeEventEmitterWrapper();
    const subscription = emitter.subscribeOnPhotoUploaded(({ mediaId }) => {
      photosUploadedRef.current.push(mediaId);
    });

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  const isEffectRunning = useRef(false);

  const countRef = useRef(0);
  useEffect(() => {
    async function innerAsync() {
      if (isEffectRunning.current) {
        return;
      }

      try {
        isEffectRunning.current = true;

        if (photosUploadedRef.current.length == 0) {
          return;
        }

        const currentPhotosUploaded = [...photosUploadedRef.current];
        const nbCurrentPhotos = currentPhotosUploaded.length;

        const photos = [];

        for (let i = 0; i < nbCurrentPhotos; i++) {
          const mediaId = currentPhotosUploaded[i];

          countRef.current++;
          console.log('Effect UploadWorker count ', countRef.current);
          console.log('Effect UploadWorker current mediaId: ', mediaId);

          const ret = await GetPhotosByMediaId.Post({
            photosData: [{ mediaId: mediaId }],
            photoType: 'data',
            deviceUniqueId: uniqueDeviceId,
          });

          if (!ret.ok || !ret.data.photos[0].exists) {
            console.log('photo just added but not found on server, mediaId: ', mediaId);
            return;
          }

          photos.push(ParseApiPhoto(ret.data.photos[0].photo));
        }

        dispatch(
          addPhotosFromLocalToServer({
            photosServer: photos,
            mediaIds: currentPhotosUploaded,
          }),
        );

        photosUploadedRef.current = photosUploadedRef.current.slice(nbCurrentPhotos);
      } finally {
        isEffectRunning.current = false;
      }
    }

    innerAsync().catch(console.log);
  }, [dispatch, rerunEffect]);

  return props.children;
};
