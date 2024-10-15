import { useCallback, useMemo } from 'react';

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

  const IsUploadRunning = useMemo(() => {
    return currentPhotosUploading.size != 0 || queuedPhotosToUpload.size != 0;
  }, [currentPhotosUploading.size, queuedPhotosToUpload.size]);

  return {
    UploadPhotosWorker,
    IsMediaIdUploadQueued,
    IsUploadRunning,
  };
}
