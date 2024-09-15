import { useCallback } from 'react';

import { Promise as BluebirdPromise } from 'bluebird';

import { ParseApiPhoto } from '~/Context/ReduxStore/Slices/Photos/Functions';
import { PhotoServerType, setPhotosServer } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useAppDispatch } from '~/Context/ReduxStore/Store';
import { photoCompressedExistsInCache } from '~/Helpers/GalleryFunctions/Functions';
import { getPhotosBatched } from '~/Helpers/Queries';

import { useServerQueriesContextInner } from './ServerQueriesContext';

export function useServerQueriesContext() {
  const dispatch = useAppDispatch();

  const { isFetchingRef, setFetchingStatus, setResultStatus } = useServerQueriesContextInner();

  const RefreshServerPhotos = useCallback(
    async (n: number) => {
      if (isFetchingRef.current) {
        return;
      }

      isFetchingRef.current = true;
      setFetchingStatus('Fetching');

      try {
        const photosFromServer = await getPhotosBatched({
          number: n,
          offset: 0,
          photoType: 'data',
        });

        if (!photosFromServer.ok) {
          console.log('failed to get photos from server');
          throw new Error(
            'failed to get photos from server, ' +
              photosFromServer.errorCode +
              ', ' +
              photosFromServer.message,
          );
        }

        // BluebirdPromise is used because Promise.all gives a warning when too many promises are created simultaneously
        // Excessive number of pending callbacks: 501. Some pending callbacks that might have leaked by never being called from native code
        // BluebirdPromise allows to set a limit on how many concurrent promises are created

        const photosThumbnailExistsInCache = await BluebirdPromise.map(
          photosFromServer.data.photos,
          photo => {
            return photoCompressedExistsInCache(photo.id);
          },
          { concurrency: 100 },
        );
        const photosCompressedExistsInCache = await BluebirdPromise.map(
          photosFromServer.data.photos,
          photo => {
            return photoCompressedExistsInCache(photo.id);
          },
          { concurrency: 100 },
        );

        const photos: PhotoServerType[] = photosFromServer.data.photos.map((photo, index) => {
          const photoThumbnailExistsInCache = photosThumbnailExistsInCache[index];
          const photoCompressedExistsInCache = photosCompressedExistsInCache[index];

          const parsedPhoto = ParseApiPhoto(photo);
          parsedPhoto.uriThumbnail = photoThumbnailExistsInCache.exists
            ? photoThumbnailExistsInCache.uri
            : undefined;
          parsedPhoto.uriCompressed = photoCompressedExistsInCache.exists
            ? photoCompressedExistsInCache.uri
            : undefined;

          return parsedPhoto;
        });

        dispatch(setPhotosServer(photos));

        setResultStatus('Success');
      } catch (e) {
        setResultStatus('Failed');
        console.log(e);
      } finally {
        isFetchingRef.current = false;
        setFetchingStatus('Idle');
      }
    },
    [dispatch, isFetchingRef, setFetchingStatus, setResultStatus],
  );

  return { RefreshServerPhotos };
}
