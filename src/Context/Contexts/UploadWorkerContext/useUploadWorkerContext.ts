import { useCallback } from 'react';

import { useUploadWorkerContextInner } from './UploadWorkerContext';

export function useUploadWorkerContext() {
  const { setQueuedPhotosToUpload, currentPhotosUploading, queuedPhotosToUpload } =
    useUploadWorkerContextInner();

  const UploadPhotosWorker = useCallback(
    (mediaIds: string[]) => {
      setQueuedPhotosToUpload(oldQueued => {
        return new Set([...oldQueued, ...mediaIds]);
      });
    },
    [setQueuedPhotosToUpload],
  );

  return { UploadPhotosWorker, currentPhotosUploading, queuedPhotosToUpload };
}
