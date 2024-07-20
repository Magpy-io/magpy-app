import React, { ReactNode, useEffect, useRef } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { ParseApiPhoto } from '~/Context/ReduxStore/Slices/Photos/Functions';
import { addPhotoFromLocalToServer } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useAppDispatch } from '~/Context/ReduxStore/Store';
import { GetPhotosByMediaId } from '~/Helpers/ServerQueries';
import { NativeEventEmitterWrapper } from '~/NativeModules/NativeModulesEventNames';

import { useUploadWorkerContext } from './UploadWorkerContext';
import { useUploadWorkerFunctions } from './useUploadWorkerContext';

type PropsType = {
  children: ReactNode;
};

export const UploadWorkerEffects: React.FC<PropsType> = props => {
  const dispatch = useAppDispatch();

  const { photosUploaded } = useUploadWorkerContext();
  const { photosUploadedPush, photosUploadedShift } = useUploadWorkerFunctions();

  useEffect(() => {
    const emitter = new NativeEventEmitterWrapper();
    const subscription = emitter.subscribeOnPhotoUploaded(({ mediaId }) => {
      photosUploadedPush(mediaId);
    });

    return () => {
      subscription.remove();
    };
  }, [photosUploadedPush]);

  const isEffectRunning = useRef(false);

  const countRef = useRef(0);
  useEffect(() => {
    async function innerAsync() {
      if (isEffectRunning.current) {
        return;
      }

      try {
        isEffectRunning.current = true;

        if (photosUploaded.length == 0) {
          return;
        }

        const currentPhotosUploaded = [...photosUploaded];
        const nbCurrentPhotos = currentPhotosUploaded.length;

        const photos = [];

        for (let i = 0; i < nbCurrentPhotos; i++) {
          const mediaId = currentPhotosUploaded[0];

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

        for (let i = 0; i < nbCurrentPhotos; i++) {
          dispatch(
            addPhotoFromLocalToServer({
              photoServer: photos[i],
              mediaId: currentPhotosUploaded[i],
            }),
          );
        }

        photosUploadedShift(nbCurrentPhotos);
      } finally {
        isEffectRunning.current = false;
      }
    }

    innerAsync().catch(console.log);
  }, [dispatch, photosUploaded, photosUploadedShift]);

  return props.children;
};
