import { useEffect, useRef } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { addPhotoFromServerToLocal } from '~/Context/ReduxStore/Slices/Photos';
import { useAppDispatch } from '~/Context/ReduxStore/Store';
import { addPhotoToDevice, getPhotoFromDevice } from '~/Helpers/GetGalleryPhotos';
import * as Queries from '~/Helpers/Queries';
import { UpdatePhotoPath } from '~/Helpers/ServerQueries';

import * as PhotosDownloadingActions from './PhotosDownloadingActions';
import {
  usePhotosDownloadingContext,
  usePhotosDownloadingDispatch,
} from './PhotosDownloadingContext';

export function usePhotosDownloadingEffect() {
  const photosDownloadingDispatch = usePhotosDownloadingDispatch();
  const photosDownloadingContext = usePhotosDownloadingContext();
  const { photosDownloading } = photosDownloadingContext;

  const AppDisptach = useAppDispatch();

  const isEffectRunning = useRef(false);

  useEffect(() => {
    async function innerAsync() {
      if (isEffectRunning.current) {
        return;
      }

      try {
        isEffectRunning.current = true;

        if (photosDownloading.length == 0) {
          return;
        }

        const photoDownloading = photosDownloading[0];

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
        const photoServer = result.data.photo;

        const mediaId = await addPhotoToDevice({
          fileName: photoServer.meta.name,
          id: photoServer.id,
          image64: photoServer.image64,
        });

        const localPhoto = await getPhotoFromDevice(mediaId);

        AppDisptach(
          addPhotoFromServerToLocal({ photoLocal: localPhoto, serverId: photoServer.id }),
        );

        const result1 = await UpdatePhotoPath.Post({
          id: photoServer.id,
          path: localPhoto.uri,
          deviceUniqueId: uniqueDeviceId,
        });

        console.log(localPhoto.uri);

        if (!result1.ok) {
          console.log('Error updating uri on server');
          console.log(result1.errorCode);
        }

        photosDownloadingDispatch(PhotosDownloadingActions.shift());
      } finally {
        isEffectRunning.current = false;
      }
    }

    innerAsync().catch(console.log);
  }, [photosDownloadingDispatch, AppDisptach, photosDownloading]);
}
