import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { ParseApiPhoto } from '~/Context/ReduxStore/Slices/Photos/Functions';
import { addPhotosFromLocalToServer } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useAppDispatch } from '~/Context/ReduxStore/Store';
import { APIPhoto } from '~/Helpers/ServerQueries/Types';
import { useHasValueChanged } from '~/Hooks/useHasValueChanged';
import {
  UploadMediaEvents,
  UploadMediaModule,
  WorkerStatus,
  isWorkerStatusFinished,
} from '~/NativeModules/UploadMediaModule';

import { useServerContext } from '../ServerContext';
import { useServerInvalidationContext } from '../ServerInvalidationContext';
import { useUploadWorkerContextInner } from './UploadWorkerContext';

type PropsType = {
  children: ReactNode;
};

export const UploadWorkerEffects: React.FC<PropsType> = props => {
  const photosUploadedRef = useRef<{ mediaId: string; photo: APIPhoto }[]>([]);

  const dispatch = useAppDispatch();

  const { serverPath, token } = useServerContext();
  const [rerunEffect, setRerunEffect] = useState(false);

  const [workerStatus, setWorkerStatus] = useState<WorkerStatus>('WORKER_SUCCESS');
  const workerStatusChanged = useHasValueChanged(workerStatus, 'WORKER_SUCCESS');

  const {
    queuedPhotosToUpload,
    currentPhotosUploading,
    setCurrentPhotosUploading,
    setQueuedPhotosToUpload,
  } = useUploadWorkerContextInner();

  useEffect(() => {
    // The interval is used to batch store updates when photos are uploaded,
    // instead of running a store update after each photo upload.
    // This improves performance significantly specially when backing up large amount of photos
    const interval = setInterval(() => {
      setRerunEffect(s => !s);
    }, 2000);

    const subscription = UploadMediaEvents.subscribeOnPhotoUploaded(eventData => {
      photosUploadedRef.current.push(eventData);
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

      const photos = currentPhotosUploaded.map(photo => ParseApiPhoto(photo.photo));
      const mediaIds = currentPhotosUploaded.map(photo => photo.mediaId);

      dispatch(
        addPhotosFromLocalToServer({
          photosServer: photos,
          mediaIds,
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
  }, [dispatch, InvalidatePhotos, rerunEffect]);

  useEffect(() => {
    async function asyncInner() {
      if (queuedPhotosToUpload.size == 0 || currentPhotosUploading.size != 0) {
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
    setCurrentPhotosUploading,
    setQueuedPhotosToUpload,
    InvalidatePhotosByMediaId,
    serverPath,
    token,
  ]);

  useEffect(() => {
    if (!workerStatusChanged) {
      return;
    }

    if (!isWorkerStatusFinished(workerStatus)) {
      return;
    }

    // On worker finished

    // Invalidate current photos uploading
    if (currentPhotosUploading.size != 0) {
      InvalidatePhotosByMediaId({
        mediaIds: Array.from(currentPhotosUploading),
      });
    }

    setCurrentPhotosUploading(new Set());
  }, [
    InvalidatePhotosByMediaId,
    setCurrentPhotosUploading,
    currentPhotosUploading,
    workerStatus,
    workerStatusChanged,
  ]);

  return props.children;
};
