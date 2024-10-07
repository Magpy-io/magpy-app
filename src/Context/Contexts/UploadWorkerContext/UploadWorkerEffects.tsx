import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { ParseApiPhoto } from '~/Context/ReduxStore/Slices/Photos/Functions';
import { addPhotosFromLocalToServer } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useAppDispatch } from '~/Context/ReduxStore/Store';
import { GetPhotosByMediaId } from '~/Helpers/ServerQueries';
import {
  UploadMediaEvents,
  UploadMediaModule,
  WorkerStatus,
  isWorkerStatusFinished,
} from '~/NativeModules/UploadMediaModule';

import { useServerContext } from '../ServerContext';
import { useServerInvalidationContext } from '../ServerInvalidationContext';
import { useUploadWorkerContext } from './UploadWorkerContext';

type PropsType = {
  children: ReactNode;
};

export const UploadWorkerEffects: React.FC<PropsType> = props => {
  const photosUploadedRef = useRef<string[]>([]);

  const dispatch = useAppDispatch();

  const { serverPath, token } = useServerContext();
  const [rerunEffect, setRerunEffect] = useState(false);

  const [workerStatus, setWorkerStatus] = useState<WorkerStatus>('WORKER_SUCCESS');

  const {
    queuedPhotosToUpload,
    currentPhotosUploading,
    setCurrentPhotosUploading,
    setQueuedPhotosToUpload,
  } = useUploadWorkerContext();

  useEffect(() => {
    // The interval is used to batch store updates when photos are uploaded,
    // instead of running a store update after each photo upload.
    // This improves performance significantly specially when backing up large amount of photos
    const interval = setInterval(() => {
      setRerunEffect(s => !s);
    }, 2000);

    const subscription = UploadMediaEvents.subscribeOnPhotoUploaded(({ mediaId }) => {
      photosUploadedRef.current.push(mediaId);
    });

    const subscriptionWorkerStatus = UploadMediaEvents.subscribeOnWorkerStatusChanged(
      ({ status }) => {
        setWorkerStatus(status);
      },
    );

    return () => {
      subscription.remove();
      subscriptionWorkerStatus.remove();
      clearInterval(interval);
    };
  }, []);

  const isEffectRunning = useRef(false);

  const { InvalidatePhotos, InvalidatePhotosByMediaId } = useServerInvalidationContext();

  useEffect(() => {
    async function asyncInner() {
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

        const ret = await GetPhotosByMediaId.Post({
          photosData: currentPhotosUploaded.map(mediaId => {
            return { mediaId };
          }),
          photoType: 'data',
          deviceUniqueId: uniqueDeviceId,
        });

        if (!ret.ok) {
          console.log('Failed to get photos from server');
          throw new Error(
            'Failed to get photos from server, ' + ret.errorCode + ', ' + ret.message,
          );
        }

        const photos = [];
        const mediaIdsThatExistsInServer = [];

        for (let i = 0; i < currentPhotosUploaded.length; i++) {
          const retPhoto = ret.data.photos[i];
          if (!retPhoto.exists) {
            console.log(
              'UploadWorkerEffects: photo just added but not found on server, mediaId: ',
              retPhoto.mediaId,
            );
            continue;
          }

          photos.push(ParseApiPhoto(retPhoto.photo));
          mediaIdsThatExistsInServer.push(retPhoto.mediaId);
        }

        dispatch(
          addPhotosFromLocalToServer({
            photosServer: photos,
            mediaIds: mediaIdsThatExistsInServer,
          }),
        );

        InvalidatePhotos({
          serverIds: photos.map(photo => {
            return photo.id;
          }),
        });

        photosUploadedRef.current = photosUploadedRef.current.slice(nbCurrentPhotos);
      } finally {
        isEffectRunning.current = false;
      }
    }

    asyncInner().catch(console.log);
  }, [dispatch, InvalidatePhotos, rerunEffect]);

  useEffect(() => {
    async function asyncInner() {
      if (!isWorkerStatusFinished(workerStatus)) {
        return;
      }

      // If worker finished, invalidate current photos uploading
      if (currentPhotosUploading.size != 0) {
        InvalidatePhotosByMediaId({
          mediaIds: Array.from(currentPhotosUploading),
        });
      }

      if (queuedPhotosToUpload.size == 0) {
        return;
      }

      setCurrentPhotosUploading(queuedPhotosToUpload);
      setQueuedPhotosToUpload(new Set());

      await UploadMediaModule.StartUploadWorker({
        url: serverPath ?? '',
        deviceId: uniqueDeviceId,
        serverToken: token ?? '',
        photosIds: Array.from(queuedPhotosToUpload),
      });
    }

    asyncInner().catch(console.log);
  }, [
    queuedPhotosToUpload,
    currentPhotosUploading,
    serverPath,
    setCurrentPhotosUploading,
    setQueuedPhotosToUpload,
    token,
    workerStatus,
    InvalidatePhotosByMediaId,
  ]);

  return props.children;
};
