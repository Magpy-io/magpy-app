import { useCallback } from 'react';

import { useUploadWorkerContext } from './UploadWorkerContext';

export function useUploadWorkerFunctions() {
  const { setQueuedPhotosToUpload } = useUploadWorkerContext();

  const UploadPhotosWorker = useCallback(
    (mediaIds: string[]) => {
      setQueuedPhotosToUpload(oldQueued => {
        return new Set([...oldQueued, ...mediaIds]);
      });
    },
    [setQueuedPhotosToUpload],
  );

  return { UploadPhotosWorker };
}
