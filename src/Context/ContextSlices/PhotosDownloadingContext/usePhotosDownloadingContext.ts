import { useCallback } from 'react';

import * as PhotosDownloadingActions from './PhotosDownloadingActions';
import { usePhotosDownloadingDispatch } from './PhotosDownloadingContext';

export function usePhotosDownloadingFunctions() {
  const photosDownloadingDispatch = usePhotosDownloadingDispatch();

  const DownloadPhotos = useCallback(
    (photosServerId: string[]) => {
      photosDownloadingDispatch(PhotosDownloadingActions.addMultiple(photosServerId));
    },
    [photosDownloadingDispatch],
  );

  return { DownloadPhotos };
}
