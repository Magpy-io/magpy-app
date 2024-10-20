import { useCallback } from 'react';

import { GetPhotos } from '~/Helpers/ServerQueries';
import { APIPhoto } from '~/Helpers/ServerQueries/Types';

import { useServerQueries } from './useServerQueries';

const BATCH_SIZE = 500;

export function useGetPhotosBatched() {
  const { GetPhotosPost } = useServerQueries();

  const getPhotosBatched = useCallback(
    async ({
      number,
      offset,
      photoType,
    }: GetPhotos.RequestData): Promise<GetPhotos.ResponseType> => {
      let photosLeft = number;
      let endReached = false;
      const photos: APIPhoto[] = [];
      let warning = false;

      while (photosLeft > 0 && !endReached) {
        const ret: GetPhotos.ResponseType = await GetPhotosPost({
          number: photosLeft > BATCH_SIZE ? BATCH_SIZE : photosLeft,
          offset: offset + photos.length,
          photoType,
        });

        if (!ret.ok) {
          return ret;
        }

        warning ||= ret.warning;
        endReached = ret.data.endReached;
        photos.push(...ret.data.photos);

        photosLeft -= BATCH_SIZE;
      }

      return { ok: true, data: { endReached, photos, number: photos.length }, warning };
    },
    [GetPhotosPost],
  );

  return { getPhotosBatched };
}
