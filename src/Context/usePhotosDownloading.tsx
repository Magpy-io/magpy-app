import React, { useCallback, useRef } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { Actions } from '~/Context/ContextReducer';
import { addPhotoToDevice } from '~/Helpers/GetGalleryPhotos';
import * as Queries from '~/Helpers/Queries';
import { UpdatePhotoPath } from '~/Helpers/ServerQueries';
import { PhotoType } from '~/Helpers/types';

import { useMainContext } from './ContextProvider';

export type PhotosDownloadingDataType = {
  photosDownloading: React.MutableRefObject<PhotoType[]>;
  isPhotosDownloading: React.MutableRefObject<boolean>;
};

export function usePhotosDownloadingData(): PhotosDownloadingDataType {
  const photosDownloading = useRef([] as PhotoType[]);
  const isPhotosDownloading = useRef(false);

  return { photosDownloading, isPhotosDownloading };
}

export function usePhotosDownloading() {
  const { photosDownloadingData, photosDispatch } = useMainContext();

  const { photosDownloading, isPhotosDownloading } = photosDownloadingData;

  const AddSinglePhotoLocal = useCallback(
    async (photo: PhotoType) => {
      const result = await Queries.getPhotoWithProgress(photo.id, (p: number, t: number) => {
        photosDispatch({
          type: Actions.updatePhotoProgressServer,
          payload: { photo: photo, isLoading: true, p: (p + 1) / t },
        });
      });

      if (!result.ok) {
        console.log(result.errorCode);
        return;
      }

      const image64 = result.data.photo.image64;
      const newUri = await addPhotoToDevice(photo, image64);

      photo.image.path = newUri;
      photosDispatch({ type: Actions.addPhotoLocal, payload: { photo: photo } });
      photosDispatch({
        type: Actions.updatePhotoProgressServer,
        payload: { photo: photo, isLoading: false, p: 0 },
      });

      const result1 = await UpdatePhotoPath.Post({
        id: photo.id,
        path: newUri,
        deviceUniqueId: uniqueDeviceId,
      });

      if (!result1.ok) {
        console.log(result1.errorCode);
        return;
      }
    },
    [photosDispatch],
  );

  const AddPhotosLocal = useCallback(
    async (photos: PhotoType[]) => {
      try {
        for (let i = 0; i < photos.length; i++) {
          if (!photos[i].isLoading && !photos[i].inDevice) {
            photosDispatch({
              type: Actions.updatePhotoProgressServer,
              payload: { photo: photos[i], isLoading: true, p: 0 },
            });
            photosDownloading.current.push(photos[i]);
          }
        }

        if (isPhotosDownloading.current) {
          return;
        }

        while (photosDownloading.current.length != 0) {
          isPhotosDownloading.current = true;
          const photo = photosDownloading.current.shift() as PhotoType;
          try {
            await AddSinglePhotoLocal(photo);
          } catch (err) {
            console.log(`error while downloading photo with id ${photo.id}`);
            console.log(err);
          }
        }
        isPhotosDownloading.current = false;
      } catch (err) {
        console.log(err);
      }
    },
    [AddSinglePhotoLocal, isPhotosDownloading, photosDispatch, photosDownloading],
  );

  return { AddSinglePhotoLocal, AddPhotosLocal };
}
