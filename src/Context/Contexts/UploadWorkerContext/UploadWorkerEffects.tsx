import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { ParseApiPhoto } from '~/Context/ReduxStore/Slices/Photos/Functions';
import { addPhotosFromLocalToServer } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useAppDispatch } from '~/Context/ReduxStore/Store';
import { APIPhoto } from '~/Helpers/ServerQueries/Types';
import { useHasValueChanged } from '~/Hooks/useHasValueChanged';
import { useToast } from '~/Hooks/useToast';
import {
  ClearWorkerDataInputFiles,
  UploadMediaEvents,
  UploadMediaModule,
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

  const isEffectRunning = useRef(false);

  const { InvalidatePhotos, InvalidatePhotosByMediaId } = useServerInvalidationContext();

  const { workerStatus, setWorkerStatus } = useUploadWorkerContextInner();

  const workerStatusChanged = useHasValueChanged(workerStatus, 'WORKER_SUCCESS');

  const { showToastError } = useToast();

  const {
    queuedPhotosToUpload,
    currentPhotosUploading,
    setCurrentPhotosUploading,
    setQueuedPhotosToUpload,
  } = useUploadWorkerContextInner();

  // Effect to capture photo uploaded events.
  useEffect(() => {
    const subscriptionPhotoUploaded = UploadMediaEvents.subscribeOnPhotoUploaded(eventData => {
      photosUploadedRef.current.push(eventData);
    });

    return () => {
      subscriptionPhotoUploaded.remove();
    };
  }, []);

  // Effect to update Upload worker status
  useEffect(() => {
    const subscriptionWorkerStatus = UploadMediaEvents.subscribeOnWorkerStatusChanged(
      ({ status }) => {
        setWorkerStatus(status);
      },
    );

    // Initial worker status
    UploadMediaModule.IsWorkerAlive()
      .then(workerRunning => {
        setWorkerStatus(workerRunning ? 'WORKER_RUNNING' : 'WORKER_SUCCESS');
      })
      .catch(console.log);

    return () => {
      subscriptionWorkerStatus.remove();
    };
  }, [setWorkerStatus]);

  // Effect to keep re-running the next effect
  useEffect(() => {
    // The interval is used to batch store updates when photos are uploaded,
    // instead of running a store update after each photo upload.
    // This improves performance significantly specially when backing up large amount of photos
    const interval = setInterval(() => {
      setRerunEffect(s => !s);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Effect to treat photo uploaded events
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

  // Effect to start photos upload worker when photos present in queue
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

    asyncInner().catch(err => {
      setCurrentPhotosUploading(new Set());
      showToastError('Photos upload failed.');
      console.log(err);
    });
  }, [
    queuedPhotosToUpload,
    currentPhotosUploading,
    setCurrentPhotosUploading,
    setQueuedPhotosToUpload,
    InvalidatePhotosByMediaId,
    showToastError,
    serverPath,
    token,
  ]);

  // Effect that runs after an upload worker finishes
  useEffect(() => {
    if (!workerStatusChanged) {
      return;
    }

    if (workerStatus && !isWorkerStatusFinished(workerStatus)) {
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

    if (workerStatus == 'WORKER_FAILED') {
      showToastError('Photos upload failed.');
    }
  }, [
    InvalidatePhotosByMediaId,
    setCurrentPhotosUploading,
    currentPhotosUploading,
    workerStatus,
    workerStatusChanged,
    showToastError,
  ]);

  // Effect to clear worker data input files when worker not running.
  useEffect(() => {
    if (workerStatus && isWorkerStatusFinished(workerStatus)) {
      ClearWorkerDataInputFiles().catch(console.log);
    }
  }, [workerStatus]);

  return props.children;
};
