import { useCallback } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { ParseApiPhoto } from '~/Context/ReduxStore/Slices/Photos/Functions';
import {
  PhotoLocalType,
  PhotoServerType,
  addPhotoFromServerToLocal,
  addPhotosFromLocalToServer,
  deletePhotosFromServer,
  setPhotosServer,
} from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useAppDispatch } from '~/Context/ReduxStore/Store';
import { getPhotosBatched } from '~/Helpers/Queries';
import { GetPhotosById, GetPhotosByMediaId } from '~/Helpers/ServerQueries';

export function useServerRequestsInner() {
  const dispatch = useAppDispatch();

  const RefreshServerPhotosRequest = useCallback(
    async (n: number) => {
      const photosFromServer = await getPhotosBatched({
        number: n,
        offset: 0,
        photoType: 'data',
      });

      if (!photosFromServer.ok) {
        console.log('RefreshServerPhotosRequest: failed to get photos from server');
        throw new Error(
          'RefreshServerPhotosRequest: failed to get photos from server, ' +
            photosFromServer.errorCode +
            ', ' +
            photosFromServer.message,
        );
      }

      const photos: PhotoServerType[] = photosFromServer.data.photos.map(ParseApiPhoto);

      dispatch(setPhotosServer(photos));
    },
    [dispatch],
  );

  const UploadPhotosRequest = useCallback(
    async ({ mediaIds }: { mediaIds: string[] }) => {
      const ret = await GetPhotosByMediaId.Post({
        photosData: mediaIds.map(mediaId => {
          return { mediaId };
        }),
        photoType: 'data',
        deviceUniqueId: uniqueDeviceId,
      });

      if (!ret.ok) {
        console.log('UploadPhotosRequest: failed to get photos from server');
        throw new Error(
          'UploadPhotosRequest: failed to get photos from server, ' +
            ret.errorCode +
            ', ' +
            ret.message,
        );
      }

      const photos = [];
      const mediaIdsThatExistsInServer = [];

      for (let i = 0; i < mediaIds.length; i++) {
        const retPhoto = ret.data.photos[i];
        if (!retPhoto.exists) {
          console.log(
            'UploadWorkerEffects: photo just added but not found on server, mediaId: ',
            retPhoto.mediaId,
          );
          continue;
        }

        photos.push(ParseApiPhoto(retPhoto.photo));
        mediaIdsThatExistsInServer.push(retPhoto.mediaId);
      }

      dispatch(
        addPhotosFromLocalToServer({
          photosServer: photos,
          mediaIds: mediaIdsThatExistsInServer,
        }),
      );
    },
    [dispatch],
  );

  const PhotoDownloadRequest = useCallback(
    async ({ localPhoto, serverId }: { localPhoto: PhotoLocalType; serverId: string }) => {
      const ret = await GetPhotosById.Post({ ids: [serverId], photoType: 'data' });

      if (!ret.ok) {
        console.log('PhotoDownloadRequest: failed to get photos from server');
        throw new Error(
          'PhotoDownloadRequest: failed to get photos from server, ' +
            ret.errorCode +
            ', ' +
            ret.message,
        );
      }

      let mediaIdAddedToServer = false;
      if (ret.data.photos[0].exists) {
        const photoMediaId = ret.data.photos[0].photo.meta.mediaIds.find(
          v => v.deviceUniqueId == uniqueDeviceId,
        );

        if (photoMediaId && photoMediaId.mediaId == localPhoto.id) {
          mediaIdAddedToServer = true;
        }
      }

      if (mediaIdAddedToServer) {
        dispatch(addPhotoFromServerToLocal({ photoLocal: localPhoto, serverId }));
      }
    },
    [dispatch],
  );

  const DeletePhotosServerRequest = useCallback(
    async ({ serverIds }: { serverIds: string[] }) => {
      const ret = await GetPhotosById.Post({ ids: serverIds, photoType: 'data' });

      if (!ret.ok) {
        console.log('DeletePhotosServerRequest: failed to get photos from server');
        throw new Error(
          'DeletePhotosServerRequest: failed to get photos from server, ' +
            ret.errorCode +
            ', ' +
            ret.message,
        );
      }

      const serverIdsDeleted: string[] = [];

      ret.data.photos.forEach(e => {
        if (!e.exists) {
          serverIdsDeleted.push(e.id);
        }
      });

      dispatch(deletePhotosFromServer({ serverIds: serverIdsDeleted }));
    },
    [dispatch],
  );

  return {
    RefreshServerPhotosRequest,
    UploadPhotosRequest,
    PhotoDownloadRequest,
    DeletePhotosServerRequest,
  };
}
