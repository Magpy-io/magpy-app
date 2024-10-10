import { useCallback } from 'react';

import * as PhotosDownloadingActions from './PhotosDownloadingActions';
import {
  usePhotosDownloadingContext,
  usePhotosDownloadingDispatch,
} from './PhotosDownloadingContext';

export function usePhotosDownloadingFunctions() {
  const photosDownloadingDispatch = usePhotosDownloadingDispatch();

  const { photosDownloading } = usePhotosDownloadingContext();

  const StartPhotosDownload = useCallback(
    (photosServerId: string[]) => {
      photosDownloadingDispatch(PhotosDownloadingActions.addMultiple(photosServerId));
    },
    [photosDownloadingDispatch],
  );

  const IsDownloadQueued = useCallback(
    (serverId: string) => {
      return photosDownloading.find(v => v.serverId == serverId) != null;
    },
    [photosDownloading],
  );

  return { StartPhotosDownload, IsDownloadQueued };
}
