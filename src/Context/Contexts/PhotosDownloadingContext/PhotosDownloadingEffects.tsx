import React, { ReactNode, useEffect, useRef } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { addPhotoFromServerToLocal } from '~/Context/ReduxStore/Slices/Photos/Photos';
import {
  photosLocalSelector,
  photosServerSelector,
} from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppDispatch, useAppSelector } from '~/Context/ReduxStore/Store';
import { addPhotoToDevice } from '~/Helpers/GalleryFunctions/Functions';
import * as Queries from '~/Helpers/Queries';
import { UpdatePhotoMediaId } from '~/Helpers/ServerQueries';

import { useServerQueriesContext } from '../ServerQueriesContext';
import * as PhotosDownloadingActions from './PhotosDownloadingActions';
import {
  usePhotosDownloadingContext,
  usePhotosDownloadingDispatch,
} from './PhotosDownloadingContext';

type PropsType = {
  children: ReactNode;
};

export const PhotosDownloadingEffects: React.FC<PropsType> = props => {
  const photosDownloadingDispatch = usePhotosDownloadingDispatch();
  const photosDownloadingContext = usePhotosDownloadingContext();
  const { photosDownloading } = photosDownloadingContext;

  const photosServer = useAppSelector(photosServerSelector);
  const photosLocal = useAppSelector(photosLocalSelector);

  const isEffectRunning = useRef(false);

  const { DownloadServerPhoto } = useServerQueriesContext();

  const dispatch = useAppDispatch();

  useEffect(() => {
    async function innerAsync() {
      if (isEffectRunning.current) {
        return;
      }

      if (photosDownloading.length == 0) {
        return;
      }

      try {
        isEffectRunning.current = true;

        const [photoDownloading] = photosDownloading;

        const serverPhotoMediaId = photosServer[photoDownloading.serverId].mediaId;

        const photoFoundInLocal = photosLocal[serverPhotoMediaId ?? ''];

        if (photoFoundInLocal) {
          return;
        }

        console.log('Downloading  photo', photoDownloading.serverId);

        const result = await Queries.getPhotoWithProgress(
          photoDownloading.serverId,
          (p: number, t: number) => {
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
          return;
        }

        console.log('photo downloaded');
        const photoServer = result.data.photo;

        const localPhoto = await addPhotoToDevice({
          fileName: photoServer.meta.name,
          id: photoServer.id,
          image64: photoServer.image64,
        });

        const result1 = await UpdatePhotoMediaId.Post({
          id: photoServer.id,
          mediaId: localPhoto.id,
          deviceUniqueId: uniqueDeviceId,
        });

        if (!result1.ok) {
          console.log('Error updating uri on server');
          console.log(result1.errorCode);
          return;
        }

        dispatch(
          addPhotoFromServerToLocal({ photoLocal: localPhoto, serverId: photoServer.id }),
        );
        DownloadServerPhoto({ localPhoto, serverId: photoServer.id });
      } finally {
        photosDownloadingDispatch(PhotosDownloadingActions.shift());
        isEffectRunning.current = false;
      }
    }

    innerAsync().catch(console.log);
  }, [
    photosDownloadingDispatch,
    DownloadServerPhoto,
    photosDownloading,
    photosServer,
    photosLocal,
    dispatch,
  ]);

  return props.children;
};
