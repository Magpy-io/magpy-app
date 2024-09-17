import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import {
  UploadMediaEvents,
  UploadMediaModule,
  WorkerStatus,
  isWorkerStatusFinished,
} from '~/NativeModules/UploadMediaModule';

import { useServerContext } from '../ServerContext';
import { useServerQueriesContext } from '../ServerQueriesContext';
import { useUploadWorkerContext } from './UploadWorkerContext';

type PropsType = {
  children: ReactNode;
};

export const UploadWorkerEffects: React.FC<PropsType> = props => {
  const photosUploadedRef = useRef<string[]>([]);

  const { serverPath, token } = useServerContext();
  const [rerunEffect, setRerunEffect] = useState(false);

  const [workerStatus, setWorkerStatus] = useState<WorkerStatus>('WORKER_SUCCESS');

  const { queuedPhotosToUpload, setCurrentPhotosUploading, setQueuedPhotosToUpload } =
    useUploadWorkerContext();

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

  const { UploadServerPhotos } = useServerQueriesContext();

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

      UploadServerPhotos(currentPhotosUploaded);

      photosUploadedRef.current = photosUploadedRef.current.slice(nbCurrentPhotos);
    } finally {
      isEffectRunning.current = false;
    }
  }, [UploadServerPhotos, rerunEffect]);

  useEffect(() => {
    async function asyncInner() {
      if (!isWorkerStatusFinished(workerStatus)) {
        return;
      }

      if (queuedPhotosToUpload.size == 0) {
        return;
      }

      setQueuedPhotosToUpload(new Set());
      setCurrentPhotosUploading(queuedPhotosToUpload);

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
    serverPath,
    setCurrentPhotosUploading,
    setQueuedPhotosToUpload,
    token,
    workerStatus,
  ]);

  return props.children;
};
