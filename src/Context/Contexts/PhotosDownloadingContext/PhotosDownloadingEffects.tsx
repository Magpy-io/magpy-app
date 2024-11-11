import React, { ReactNode, useEffect, useRef } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { addPhotoFromServerToLocal } from '~/Context/ReduxStore/Slices/Photos/Photos';
import {
  photosLocalSelector,
  photosServerSelector,
} from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppDispatch, useAppSelector } from '~/Context/ReduxStore/Store';
import { addPhotoToDevice } from '~/Helpers/GalleryFunctions/Functions';
import { LOG } from '~/Helpers/Logging/Logger';
import { useGetPhotoWithProgress, useServerQueries } from '~/Hooks/useServerQueries';
import { useToast } from '~/Hooks/useToast';

import { useServerInvalidationContext } from '../ServerInvalidationContext';
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

  const { InvalidatePhotos } = useServerInvalidationContext();

  const { showToastError } = useToast();

  const { getPhotoWithProgress } = useGetPhotoWithProgress();
  const { UpdatePhotoMediaIdPost } = useServerQueries();

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

        const resultDownload = await getPhotoWithProgress(
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

        if (!resultDownload.ok) {
          // TODO manage retries
          throw new Error('Error downloading photo, ' + JSON.stringify(resultDownload));
        }

        const photoServer = resultDownload.data.photo;

        if (!photoServer.image64) {
          throw new Error('Error downloading photo, photo not found on disk');
        }

        const localPhoto = await addPhotoToDevice({
          fileName: photoServer.meta.name,
          id: photoServer.id,
          image64: photoServer.image64,
        });

        const resultMediaIdUpdate = await UpdatePhotoMediaIdPost({
          id: photoServer.id,
          mediaId: localPhoto.id,
          deviceUniqueId: uniqueDeviceId,
        });

        if (!resultMediaIdUpdate.ok) {
          throw new Error(
            'Error updating uri on server, ' + JSON.stringify(resultMediaIdUpdate),
          );
        }

        dispatch(
          addPhotoFromServerToLocal({ photoLocal: localPhoto, serverId: photoServer.id }),
        );
        InvalidatePhotos({ serverIds: [photoServer.id] });
      } finally {
        photosDownloadingDispatch(PhotosDownloadingActions.shift());
        isEffectRunning.current = false;
      }
    }

    innerAsync().catch(err => {
      showToastError('Error while downloading photo.');
      LOG.error(err);
    });
  }, [
    photosDownloadingDispatch,
    InvalidatePhotos,
    photosDownloading,
    photosServer,
    photosLocal,
    dispatch,
    getPhotoWithProgress,
    UpdatePhotoMediaIdPost,
    showToastError,
  ]);

  return props.children;
};
