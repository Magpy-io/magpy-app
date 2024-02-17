import { useEffect, useRef } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import {
  addMediaIdToServerPhoto,
  addPhotoFromServerToLocal,
} from '~/Context/ReduxStore/Slices/Photos';
import {
  photosLocalSelector,
  photosServerSelector,
} from '~/Context/ReduxStore/Slices/Selectors';
import { useAppDispatch, useAppSelector } from '~/Context/ReduxStore/Store';
import { addPhotoToDevice } from '~/Helpers/GalleryFunctions/Functions';
import * as Queries from '~/Helpers/Queries';
import { UpdatePhotoMediaId } from '~/Helpers/ServerQueries';

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
  const photosServer = useAppSelector(photosServerSelector);
  const photosLocal = useAppSelector(photosLocalSelector);

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

        const serverPhotoMediaId = photosServer[photoDownloading.serverId].mediaId;

        const photoFoundInLocal = photosLocal[serverPhotoMediaId ?? ''];

        if (photoFoundInLocal) {
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
        const photoServer = result.data.photo;

        const localPhoto = await addPhotoToDevice({
          fileName: photoServer.meta.name,
          id: photoServer.id,
          image64: photoServer.image64,
        });

        AppDisptach(
          addPhotoFromServerToLocal({ photoLocal: localPhoto, serverId: photoServer.id }),
        );

        const result1 = await UpdatePhotoMediaId.Post({
          id: photoServer.id,
          mediaId: localPhoto.id,
          deviceUniqueId: uniqueDeviceId,
        });

        if (!result1.ok) {
          console.log('Error updating uri on server');
          console.log(result1.errorCode);
        }

        AppDisptach(addMediaIdToServerPhoto({ id: photoServer.id, mediaId: localPhoto.id }));

        photosDownloadingDispatch(PhotosDownloadingActions.shift());
      } finally {
        isEffectRunning.current = false;
      }
    }

    innerAsync().catch(console.log);
  }, [photosDownloadingDispatch, AppDisptach, photosDownloading, photosServer, photosLocal]);
}
