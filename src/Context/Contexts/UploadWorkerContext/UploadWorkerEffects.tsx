import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { UploadMediaEvents } from '~/NativeModules/UploadMediaModule';

import { useServerQueriesContext } from '../ServerQueriesContext';

type PropsType = {
  children: ReactNode;
};

export const UploadWorkerEffects: React.FC<PropsType> = props => {
  const photosUploadedRef = useRef<string[]>([]);

  const [rerunEffect, setRerunEffect] = useState(false);

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

    return () => {
      subscription.remove();
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

  return props.children;
};
