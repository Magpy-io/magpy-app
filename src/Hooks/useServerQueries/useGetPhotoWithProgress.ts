import { useCallback } from 'react';

import { GetPhotoPartById } from '~/Helpers/ServerQueries';

import { useServerQueries } from './useServerQueries';

export function useGetPhotoWithProgress() {
  const { GetPhotoPartByIdPost } = useServerQueries();

  const getPhotoWithProgress = useCallback(
    async (id: string, f?: (progess: number, total: number) => void) => {
      const response = await GetPhotoPartByIdPost({ id: id, part: 0 });

      if (!response.ok) {
        return response;
      }
      const totalNbParts = response.data.totalNbOfParts;

      f?.(0, totalNbParts);

      const image64Parts = [response.data.photo.image64];

      let responseI: GetPhotoPartById.ResponseType;
      for (let i = 1; i < totalNbParts; i++) {
        responseI = await GetPhotoPartById.Post({ id: id, part: i });

        if (!responseI.ok) {
          return responseI;
        }

        image64Parts.push(responseI.data.photo.image64);

        f?.(i, totalNbParts);
      }
      response.data.photo.image64 = image64Parts.join('');
      return response;
    },
    [GetPhotoPartByIdPost],
  );

  return { getPhotoWithProgress };
}
