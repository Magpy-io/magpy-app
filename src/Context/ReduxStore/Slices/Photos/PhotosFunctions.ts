import { useCallback, useEffect, useRef } from 'react';

import { Promise as BluebirdPromise } from 'bluebird';

import { useServerContext } from '~/Context/Contexts/ServerContext';
import { useUploadWorkerFunctions } from '~/Context/Contexts/UploadWorkerContext';
import {
  addPhotoCompressedToCache,
  addPhotoThumbnailToCache,
  deletePhotoFromDevice,
  photoCompressedExistsInCache,
} from '~/Helpers/GalleryFunctions/Functions';
import { GalleryGetPhotos } from '~/Helpers/GalleryFunctions/GetGalleryPhotos';
import { DeletePhotosById, GetPhotos, GetPhotosById } from '~/Helpers/ServerQueries';

import { useAppDispatch } from '../../Store';
import { ParseApiPhoto } from './Functions';
import {
  PhotoGalleryType,
  PhotoLocalType,
  PhotoServerType,
  addCompressedPhotoById,
  addThumbnailPhotoById,
  deletePhotos,
  deletePhotosFromLocal,
  deletePhotosFromServer,
  setPhotosLocal,
  setPhotosServer,
} from './Photos';

export function usePhotosFunctionsStore() {
  const dispatch = useAppDispatch();

  const { isServerReachable } = useServerContext();
  const isServerReachableRef = useRef(false);
  isServerReachableRef.current = isServerReachable;

  const { UploadPhotosWorker } = useUploadWorkerFunctions();

  const RefreshLocalPhotos = useCallback(
    async (n: number) => {
      const photosFromDevice: PhotoLocalType[] = await GalleryGetPhotos(n);

      dispatch(setPhotosLocal(photosFromDevice));
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

  const ClearServerPhotos = useCallback(() => {
    dispatch(setPhotosServer([]));
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

  const RefreshAllPhotos = useCallback(
    async (nLocal: number, nServer: number) => {
      await RefreshLocalPhotos(nLocal);
      if (isServerReachableRef.current) {
        await RefreshServerPhotos(nServer);
      } else {
        ClearServerPhotos();
      }
    },
    [RefreshLocalPhotos, RefreshServerPhotos, ClearServerPhotos],
  );

  const UploadPhotos = useCallback(
    async (photos: PhotoLocalType[]) => {
      if (photos.length == 0) {
        return;
      }

      await UploadPhotosWorker(photos.map(photo => photo.id));
    },
    [UploadPhotosWorker],
  );

  const DeletePhotosLocal = useCallback(
    async (mediaIds: string[]) => {
      await deletePhotoFromDevice(mediaIds);
      dispatch(deletePhotosFromLocal({ mediaIds }));
    },
    [dispatch],
  );

  const DeletePhotosServer = useCallback(
    async (serverIds: string[]) => {
      const ret = await DeletePhotosById.Post({
        ids: serverIds,
      });

      if (!ret.ok) {
        throw new Error(ret.errorCode);
      }

      dispatch(deletePhotosFromServer({ serverIds }));
    },
    [dispatch],
  );

  const DeletePhotosEverywhere = useCallback(
    async (photos: PhotoGalleryType[]) => {
      const mediaIds: string[] = [];
      const serverIds: string[] = [];

      photos.forEach(p => {
        if (p.mediaId) {
          mediaIds.push(p.mediaId);
        }

        if (p.serverId) {
          serverIds.push(p.serverId);
        }
      });

      await deletePhotoFromDevice(mediaIds);

      const ret = await DeletePhotosById.Post({
        ids: serverIds,
      });

      if (!ret.ok) {
        throw new Error(ret.errorCode);
      }

      dispatch(deletePhotos({ photos }));
    },
    [dispatch],
  );

  return {
    RefreshLocalPhotos,
    RefreshServerPhotos,
    RefreshAllPhotos,
    AddPhotoThumbnailIfMissing,
    AddPhotoCompressedIfMissing,
    UploadPhotos,
    DeletePhotosLocal,
    DeletePhotosServer,
    DeletePhotosEverywhere,
    ClearServerPhotos,
  };
}

export function usePhotosStoreEffect() {
  const { RefreshAllPhotos } = usePhotosFunctionsStore();
  const { isServerReachable } = useServerContext();

  useEffect(() => {
    RefreshAllPhotos(3000, 3000).catch(console.log);
  }, [RefreshAllPhotos, isServerReachable]);
}
