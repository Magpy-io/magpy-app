import { useCallback } from 'react';

import * as PhotosDownloadingActions from './PhotosDownloadingActions';
import { usePhotosDownloadingDispatch } from './PhotosDownloadingContext';

export function usePhotosDownloadingFunctions() {
  const photosDownloadingDispatch = usePhotosDownloadingDispatch();

  const StartPhotosDownload = useCallback(
    (photosServerId: string[]) => {
      photosDownloadingDispatch(PhotosDownloadingActions.addMultiple(photosServerId));
    },
    [photosDownloadingDispatch],
  );

  return { StartPhotosDownload };
}
