import { useCallback } from 'react';

import { uniqueDeviceId } from '~/Config/config';
import { ParseApiPhoto } from '~/Context/ReduxStore/Slices/Photos/Functions';
import {
  PhotoServerType,
  setPhotosServer,
  updatePhotosServer,
} from '~/Context/ReduxStore/Slices/Photos/Photos';
import { useAppDispatch } from '~/Context/ReduxStore/Store';
import { useGetPhotosBatched, useServerQueries } from '~/Hooks/useServerQueries';

export function useServerRequestsInner() {
  const dispatch = useAppDispatch();

  const { getPhotosBatched } = useGetPhotosBatched();
  const { GetPhotosByIdPost, GetPhotosByMediaIdPost } = useServerQueries();

  const RefreshServerPhotosRequest = useCallback(
    async (n: number) => {
      const ret = await getPhotosBatched({
        number: n,
        offset: 0,
        photoType: 'data',
      });

      if (!ret.ok) {
        throw new Error(
          'RefreshServerPhotosRequest: failed to get photos from server, ' +
            JSON.stringify(ret),
        );
      }

      const photos: PhotoServerType[] = ret.data.photos.map(ParseApiPhoto);

      dispatch(setPhotosServer(photos));
    },
    [dispatch, getPhotosBatched],
  );

  const UpdatePhotoInfoRequest = useCallback(
    async (payload: { serverIds: string[] }) => {
      const ret = await GetPhotosByIdPost({ ids: payload.serverIds, photoType: 'data' });

      if (!ret.ok) {
        throw new Error(
          'UpdatePhotoInfoRequest: failed to get photos from server, ' + JSON.stringify(ret),
        );
      }

      const photos: { id: string; photo: PhotoServerType | null }[] = ret.data.photos.map(
        photo => {
          if (!photo.exists) {
            return { id: photo.id, photo: null };
          }

          return { id: photo.id, photo: ParseApiPhoto(photo.photo) };
        },
      );

      dispatch(updatePhotosServer(photos));
    },
    [dispatch, GetPhotosByIdPost],
  );

  const UpdatePhotoInfoByMediaIdRequest = useCallback(
    async (payload: { mediaIds: string[] }) => {
      const ret = await GetPhotosByMediaIdPost({
        deviceUniqueId: uniqueDeviceId,
        photoType: 'data',
        photosData: payload.mediaIds.map(mediaId => {
          return { mediaId };
        }),
      });

      if (!ret.ok) {
        throw new Error(
          'UpdatePhotoInfoByMediaIdRequest: failed to get photos from server, ' +
            JSON.stringify(ret),
        );
      }

      const photos: { id: string; photo: PhotoServerType }[] = ret.data.photos
        .map(photo => {
          if (!photo.exists) {
            return null;
          }

          return { id: photo.photo.id, photo: ParseApiPhoto(photo.photo) };
        })
        .filter(e => e != null);

      dispatch(updatePhotosServer(photos));
    },
    [dispatch, GetPhotosByMediaIdPost],
  );

  return {
    RefreshServerPhotosRequest,
    UpdatePhotoInfoRequest,
    UpdatePhotoInfoByMediaIdRequest,
  };
}
