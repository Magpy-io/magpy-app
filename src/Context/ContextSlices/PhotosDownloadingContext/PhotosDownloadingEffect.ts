import { useEffect, useRef } from 'react';

import { addPhotoToDevice } from '~/Helpers/GetGalleryPhotos';
import * as Queries from '~/Helpers/Queries';

import * as PhotosDownloadingActions from './PhotosDownloadingActions';
import {
  usePhotosDownloadingContext,
  usePhotosDownloadingDispatch,
} from './PhotosDownloadingContext';

export function usePhotosDownloadingEffect() {
  const photosDownloadingDispatch = usePhotosDownloadingDispatch();
  const photosDownloadingContext = usePhotosDownloadingContext();
  const { photosDownloading } = photosDownloadingContext;

  const isEffectRunning = useRef(false);

  useEffect(() => {
    async function innerAsync() {
      if (isEffectRunning.current) {
        return;
      }

      try {
        isEffectRunning.current = true;
        const photoDownloading = photosDownloading[0];

        if (!photoDownloading) {
          return;
        }

        console.log('Downloading  photo', photoDownloading.serverId);

        const result = await Queries.getPhotoWithProgress(
          photoDownloading.serverId,
          (p: number, t: number) => {
            console.log('Downloaded part', p, 'out of', t);
            photosDownloadingDispatch(
              PhotosDownloadingActions.update({
                serverId: photoDownloading.serverId,
                percentage: (p + 1) / t,
              }),
            );
          },
        );

        if (!result.ok) {
          console.log(result.errorCode);
          // TODO manage retries
          photosDownloadingDispatch(PhotosDownloadingActions.shift());
          return;
        }

        console.log('photo downloaded');
        const photo = result.data.photo;

        const newUri = await addPhotoToDevice({
          fileName: photo.meta.name,
          id: photo.id,
          image64: photo.image64,
        });

        console.log('photo saved to gallery');

        // Add local photo to redux
        // Update local uri of photo in server

        //   photo.image.path = newUri;
        //   photosDispatch({ type: Actions.addPhotoLocal, payload: { photo: photo } });

        //   const result1 = await UpdatePhotoPath.Post({
        //     id: photo.id,
        //     path: newUri,
        //     deviceUniqueId: uniqueDeviceId,
        //   });

        //   if (!result1.ok) {
        //     console.log(result1.errorCode);
        //     return;
        //   }

        photosDownloadingDispatch(PhotosDownloadingActions.shift());
      } finally {
        isEffectRunning.current = false;
      }
    }

    innerAsync().catch(console.log);
  }, [photosDownloadingDispatch, photosDownloading]);
}
