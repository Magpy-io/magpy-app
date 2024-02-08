import { useCallback, useEffect, useRef } from 'react';

import { Promise as BluebirdPromise } from 'bluebird';

import { useBackgroundServiceFunctions } from '~/Context/UseContexts/useBackgroundServiceContext';
import { useServerContext } from '~/Context/UseContexts/useServerContext';
import {
  GalleryGetPhotos,
  addPhotoCompressedToCache,
  addPhotoThumbnailToCache,
  photoCompressedExistsInCache,
} from '~/Helpers/GetGalleryPhotos';
import { GetPhotos, GetPhotosById } from '~/Helpers/ServerQueries';

import { useAppDispatch } from '../Store';
import { ParseApiPhoto } from './Functions';
import {
  PhotoLocalType,
  PhotoServerType,
  addCompressedPhotoById,
  addThumbnailPhotoById,
  setPhotosLocal,
  setPhotosServer,
} from './Photos';

export function usePhotosFunctionsStore() {
  const dispatch = useAppDispatch();

  const { SendPhotoToBackgroundServiceForUpload } = useBackgroundServiceFunctions();

  const { isServerReachable } = useServerContext();
  const isServerReachableRef = useRef(false);
  isServerReachableRef.current = isServerReachable;

  const RefreshLocalPhotos = useCallback(
    async (n: number) => {
      const photosFromDevice = await GalleryGetPhotos(n);

      const photos: PhotoLocalType[] = photosFromDevice.edges.map(edge => {
        return {
          id: edge.node.id,
          uri: edge.node.image.uri,
          fileSize: edge.node.image.fileSize ?? 0,
          fileName: edge.node.image.filename ?? '',
          height: edge.node.image.height,
          width: edge.node.image.width,
          group_name: edge.node.group_name,
          created: new Date(Math.floor(edge.node.timestamp) * 1000).toISOString(),
          modified: new Date(Math.floor(edge.node.modificationTimestamp) * 1000).toISOString(),
          type: edge.node.type,
        };
      });

      dispatch(setPhotosLocal(photos));
    },
    [dispatch],
  );

  const RefreshServerPhotos = useCallback(
    async (n: number) => {
      const photosFromServer = await GetPhotos.Post({
        number: n,
        offset: 0,
        photoType: 'data',
      });

      if (!photosFromServer.ok) {
        console.log('failed to get photos from server');
        return;
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
    },
    [dispatch],
  );

  const AddPhotoThumbnailIfMissing = useCallback(
    async (serverPhoto: PhotoServerType) => {
      if (serverPhoto.uriThumbnail) {
        return;
      }

      const res = await GetPhotosById.Post({
        ids: [serverPhoto.id],
        photoType: 'thumbnail',
      });

      if (!res.ok || !res.data.photos[0].exists) {
        throw new Error('Could not get photo by id');
      }

      const uri = await addPhotoThumbnailToCache(
        serverPhoto.id,
        res.data.photos[0].photo.image64,
      );

      dispatch(addThumbnailPhotoById({ id: serverPhoto.id, uri: uri }));
    },
    [dispatch],
  );

  const AddPhotoCompressedIfMissing = useCallback(
    async (serverPhoto: PhotoServerType) => {
      if (serverPhoto.uriCompressed) {
        return;
      }

      const res = await GetPhotosById.Post({
        ids: [serverPhoto.id],
        photoType: 'compressed',
      });

      if (!res.ok || !res.data.photos[0].exists) {
        throw new Error('Could not get photo by id');
      }

      const uri = await addPhotoCompressedToCache(
        serverPhoto.id,
        res.data.photos[0].photo.image64,
      );

      dispatch(addCompressedPhotoById({ id: serverPhoto.id, uri: uri }));
    },
    [dispatch],
  );

  const RefreshAllPhotos = useCallback(
    async (nLocal: number, nServer: number) => {
      await RefreshLocalPhotos(nLocal);
      if (isServerReachableRef.current) {
        await RefreshServerPhotos(nServer);
      }
    },
    [RefreshLocalPhotos, RefreshServerPhotos],
  );

  const UploadPhotos = useCallback(
    async (photos: PhotoLocalType[]) => {
      if (photos.length == 0) {
        return;
      }
      await SendPhotoToBackgroundServiceForUpload(photos);
    },
    [SendPhotoToBackgroundServiceForUpload],
  );

  return {
    RefreshLocalPhotos,
    RefreshServerPhotos,
    RefreshAllPhotos,
    AddPhotoThumbnailIfMissing,
    AddPhotoCompressedIfMissing,
    UploadPhotos,
  };
}

export function usePhotosStoreEffect() {
  const { RefreshAllPhotos } = usePhotosFunctionsStore();
  const { isServerReachable } = useServerContext();

  useEffect(() => {
    RefreshAllPhotos(30, 30)
      // .then(() => {
      //   return RefreshAllPhotos(300, 300);
      // })
      // .then(() => {
      //   return RefreshAllPhotos(3000, 3000);
      // })
      .catch(console.log);
  }, [RefreshAllPhotos, isServerReachable]);
}
