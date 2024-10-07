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

  const IsMediaIdUploadQueued = useCallback(
    (mediaId: string) => {
      return currentPhotosUploading.has(mediaId) || queuedPhotosToUpload.has(mediaId);
    },
    [currentPhotosUploading, queuedPhotosToUpload],
  );

  return {
    UploadPhotosWorker,
    IsMediaIdUploadQueued,
  };
}
