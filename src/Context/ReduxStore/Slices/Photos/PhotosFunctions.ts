import { useCallback, useEffect, useRef } from 'react';

import { usePermissionsContext } from '~/Context/Contexts/PermissionsContext';
import { useServerContext } from '~/Context/Contexts/ServerContext';
import { useServerInvalidationContext } from '~/Context/Contexts/ServerInvalidationContext';
import { useUploadWorkerFunctions } from '~/Context/Contexts/UploadWorkerContext';
import {
  addPhotoCompressedToCache,
  addPhotoThumbnailToCache,
  deletePhotoCompressedFromCache,
  deletePhotoThumbnailFromCache,
  deletePhotosFromDevice,
  photoCompressedExistsInCache,
  photoThumbnailExistsInCache,
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
  const { RefreshServerPhotos, InvalidatePhotos } = useServerInvalidationContext();

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
      const photoThumbnailStatus = await photoThumbnailExistsInCache(serverPhoto.id);

      let uri = '';

      if (photoThumbnailStatus.exists) {
        uri = photoThumbnailStatus.uri;
      } else {
        const res = await GetPhotosById.Post({
          ids: [serverPhoto.id],
          photoType: 'thumbnail',
        });

        if (!res.ok || !res.data.photos[0].exists) {
          throw new Error('Could not get photo by id');
        }

        uri = await addPhotoThumbnailToCache(serverPhoto.id, res.data.photos[0].photo.image64);
      }

      dispatch(addThumbnailPhotoById({ id: serverPhoto.id, uri }));
    },
    [dispatch],
  );

  const AddPhotoCompressedIfMissing = useCallback(
    async (serverPhoto: PhotoServerType) => {
      const photoCompressedStatus = await photoCompressedExistsInCache(serverPhoto.id);

      let uri = '';

      if (photoCompressedStatus.exists) {
        uri = photoCompressedStatus.uri;
      } else {
        const res = await GetPhotosById.Post({
          ids: [serverPhoto.id],
          photoType: 'compressed',
        });

        if (!res.ok || !res.data.photos[0].exists) {
          throw new Error('Could not get photo by id');
        }

        uri = await addPhotoCompressedToCache(
          serverPhoto.id,
          res.data.photos[0].photo.image64,
        );
      }

      dispatch(addCompressedPhotoById({ id: serverPhoto.id, uri }));
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

      dispatch(deletePhotosFromServer({ serverIds }));
      InvalidatePhotos({ serverIds });
    },
    [dispatch, InvalidatePhotos],
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

      dispatch(deletePhotosFromServer({ serverIds }));
      InvalidatePhotos({ serverIds });
    },
    [dispatch, InvalidatePhotos],
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
  const { RefreshServerPhotos } = useServerInvalidationContext();

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
