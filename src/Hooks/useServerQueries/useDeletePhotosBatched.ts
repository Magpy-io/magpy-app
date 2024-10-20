import { useCallback } from 'react';

import { RangeSplitter, RangeSplitterLinear } from '~/Helpers/RangeSplitter';
import { DeletePhotosById } from '~/Helpers/ServerQueries';

import { useServerQueries } from './useServerQueries';

const BATCH_SIZE = 500;

export function useDeletePhotosByIdBatched() {
  const { DeletePhotosByIdPost } = useServerQueries();

  const DeletePhotosByIdBatched = useCallback(
    async ({ ids }: DeletePhotosById.RequestData): Promise<DeletePhotosById.ResponseType> => {
      const rangeSplitter: RangeSplitter = new RangeSplitterLinear(BATCH_SIZE);

      const idsRanges = rangeSplitter.splitRange(ids.length).map(({ start, end }) => {
        return ids.slice(start, end);
      });

      let ret: DeletePhotosById.ResponseType | null = null;
      const deletedIds = [];

      for (const idsRange of idsRanges) {
        ret = await DeletePhotosByIdPost({
          ids: idsRange,
        });

        if (!ret.ok) {
          return ret;
        }

        deletedIds.push(...ret.data.deletedIds);
      }

      if (!ret) {
        throw new Error('Unexpected null value in DeletePhotosByIdBatched');
      }

      ret.data.deletedIds = deletedIds;
      return ret;
    },
    [DeletePhotosByIdPost],
  );

  return { DeletePhotosByIdBatched };
}
