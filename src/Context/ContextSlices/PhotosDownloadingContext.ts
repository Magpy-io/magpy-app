import React, { useRef } from 'react';

import { PhotoType } from '~/Helpers/types';

export type PhotosDownloadingDataType = {
  photosDownloading: React.MutableRefObject<PhotoType[]>;
  isPhotosDownloading: React.MutableRefObject<boolean>;
};

export function usePhotosDownloadingData(): PhotosDownloadingDataType {
  const photosDownloading = useRef([] as PhotoType[]);
  const isPhotosDownloading = useRef(false);

  return { photosDownloading, isPhotosDownloading };
}
