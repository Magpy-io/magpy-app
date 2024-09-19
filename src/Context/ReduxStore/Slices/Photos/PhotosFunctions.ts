import { useCallback, useEffect, useRef } from 'react';

import { usePermissionsContext } from '~/Context/Contexts/PermissionsContext';
import { useServerContext } from '~/Context/Contexts/ServerContext';
import { useServerQueriesContext } from '~/Context/Contexts/ServerQueriesContext';
import { useUploadWorkerFunctions } from '~/Context/Contexts/UploadWorkerContext';
import {
  addPhotoCompressedToCache,
  addPhotoThumbnailToCache,
  deletePhotoCompressedFromCache,
  deletePhotoThumbnailFromCache,
  deletePhotosFromDevice,
} from '~/Helpers/GalleryFunctions/Functions';
import { GalleryGetPhotos } from '~/Helpers/GalleryFunctions/GetGalleryPhotos';
import { DeletePhotosById, GetPhotosById } from '~/Helpers/ServerQueries';

import { useAppDispatch } from '../../Store';
import {
  PhotoGalleryType,
  PhotoLocalType,
  PhotoServerType,
  addCompressedPhotoById,
  addThumbnailPhotoById,
  deletePhotosFromLocal,
  setPhotosLocal,
  setPhotosServer,
} from './Photos';

export function usePhotosFunctionsStore() {
  const dispatch = useAppDispatch();

  const { isServerReachable } = useServerContext();
  const isServerReachableRef = useRef(false);
  isServerReachableRef.current = isServerReachable;

  const { UploadPhotosWorker } = useUploadWorkerFunctions();
  const { RefreshServerPhotos, DeleteServerPhotos } = useServerQueriesContext();

  const RefreshLocalPhotos = useCallback(
    async (n: number) => {
      const photosFromDevice: PhotoLocalType[] = await GalleryGetPhotos(n);

      dispatch(setPhotosLocal(photosFromDevice));
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

  const UploadPhotos = useCallback(
    (photos: PhotoLocalType[]) => {
      if (photos.length == 0) {
        return;
      }

      UploadPhotosWorker(photos.map(photo => photo.id));
    },
    [UploadPhotosWorker],
  );

  const DeletePhotosLocal = useCallback(
    async (mediaIds: string[]) => {
      await deletePhotosFromDevice(mediaIds);
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

      for (const serverId of serverIds) {
        await deletePhotoThumbnailFromCache(serverId).catch(console.log);
        await deletePhotoCompressedFromCache(serverId).catch(console.log);
      }

      DeleteServerPhotos({ serverIds });
    },
    [DeleteServerPhotos],
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

      await deletePhotosFromDevice(mediaIds);
      dispatch(deletePhotosFromLocal({ mediaIds }));

      const ret = await DeletePhotosById.Post({
        ids: serverIds,
      });

      if (!ret.ok) {
        throw new Error(ret.errorCode);
      }

      for (const serverId of serverIds) {
        await deletePhotoThumbnailFromCache(serverId).catch(console.log);
        await deletePhotoCompressedFromCache(serverId).catch(console.log);
      }

      DeleteServerPhotos({ serverIds });
    },
    [dispatch, DeleteServerPhotos],
  );

  const RefreshAllPhotos = useCallback(
    async (nLocal: number) => {
      await RefreshLocalPhotos(nLocal);
      if (isServerReachableRef.current) {
        RefreshServerPhotos();
      } else {
        ClearServerPhotos();
      }
    },
    [RefreshLocalPhotos, RefreshServerPhotos, ClearServerPhotos],
  );

  return {
    RefreshLocalPhotos,
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
  const { RefreshLocalPhotos, ClearServerPhotos } = usePhotosFunctionsStore();
  const { RefreshServerPhotos } = useServerQueriesContext();

  const { serverNetwork } = useServerContext();

  const { mediaPermissionStatus } = usePermissionsContext();

  useEffect(() => {
    async function innerEffect() {
      if (mediaPermissionStatus) {
        await RefreshLocalPhotos(5000);
      }
    }
    innerEffect().catch(console.log);
  }, [RefreshLocalPhotos, mediaPermissionStatus]);

  useEffect(() => {
    if (serverNetwork) {
      RefreshServerPhotos();
    } else {
      ClearServerPhotos();
    }
  }, [ClearServerPhotos, RefreshServerPhotos, serverNetwork]);
}
