import { useCallback } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { Actions } from '~/Context/ContextSlices/PhotosContext/PhotosReducer';
import { useMainContext } from '~/Context/MainContextProvider';
import { addPhotoToDevice } from '~/Helpers/GetGalleryPhotos';
import * as Queries from '~/Helpers/Queries';
import { UpdatePhotoPath } from '~/Helpers/ServerQueries';
import { PhotoType } from '~/Helpers/types';

export function usePhotosDownloadingFunctions() {
  const { photosDownloadingData, photosData } = useMainContext();
  const { photosDispatch } = photosData;
  const { photosDownloading, isPhotosDownloading } = photosDownloadingData;

  const AddSinglePhotoLocal = useCallback(
    async (photo: PhotoType) => {
      const result = await Queries.getPhotoWithProgress(
        photo.id,
        //(p: number, t: number) => {},
      );

      if (!result.ok) {
        console.log(result.errorCode);
        return;
      }

      const image64 = result.data.photo.image64;
      const newUri = await addPhotoToDevice(photo, image64);

      photo.image.path = newUri;
      photosDispatch({ type: Actions.addPhotoLocal, payload: { photo: photo } });

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
    [AddSinglePhotoLocal, isPhotosDownloading, photosDownloading],
  );

  return { AddSinglePhotoLocal, AddPhotosLocal };
}

export function usePhotosDownloadingContext() {
  const { photosDownloadingData } = useMainContext();

  return photosDownloadingData;
}
