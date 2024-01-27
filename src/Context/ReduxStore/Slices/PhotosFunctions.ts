import { useCallback, useEffect } from 'react';

import { Promise as BluebirdPromise } from 'bluebird';

import {
  GalleryGetPhotos,
  addPhotoCompressedToCache,
  addPhotoThumbnailToCache,
  photoCompressedExistsInCache,
} from '~/Helpers/GetGalleryPhotos';
import { GetPhotos, GetPhotosById } from '~/Helpers/ServerQueries';

import { useAppDispatch } from '../Store';
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

  const RefreshLocalPhotos = useCallback(async () => {
    const photosFromDevice = await GalleryGetPhotos(3000);

    const photos: PhotoLocalType[] = photosFromDevice.edges.map(edge => {
      return {
        id: edge.node.id,
        uri: edge.node.image.uri,
        fileSize: edge.node.image.fileSize ?? 0,
        fileName: edge.node.image.filename ?? '',
        height: edge.node.image.height,
        width: edge.node.image.width,
        group_name: edge.node.group_name,
        created: new Date(edge.node.timestamp * 1000).toISOString(),
        modified: new Date(edge.node.modificationTimestamp * 1000).toISOString(),
        type: edge.node.type,
      };
    });

    dispatch(setPhotosLocal(photos));
  }, [dispatch]);

  const RefreshServerPhotos = useCallback(async () => {
    const photosFromServer = await GetPhotos.Post({
      number: 3000,
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

      return {
        id: photo.id,
        fileSize: photo.meta.fileSize,
        fileName: photo.meta.name,
        height: photo.meta.height,
        width: photo.meta.width,
        created: photo.meta.date,
        syncDate: photo.meta.syncDate,
        clientPaths: photo.meta.clientPaths,
        uriThumbnail: photoThumbnailExistsInCache.exists
          ? photoThumbnailExistsInCache.uri
          : undefined,
        uriCompressed: photoCompressedExistsInCache.exists
          ? photoCompressedExistsInCache.uri
          : undefined,
      };
    });

    dispatch(setPhotosServer(photos));
  }, [dispatch]);

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

  return {
    RefreshLocalPhotos,
    RefreshServerPhotos,
    AddPhotoThumbnailIfMissing,
    AddPhotoCompressedIfMissing,
  };
}

export function usePhotosStoreEffect() {
  const { RefreshServerPhotos } = usePhotosFunctionsStore();
  useEffect(() => {
    RefreshServerPhotos().catch(console.log);
  }, [RefreshServerPhotos]);
}
