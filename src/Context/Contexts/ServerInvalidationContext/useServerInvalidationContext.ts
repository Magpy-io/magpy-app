import { useCallback } from 'react';

import { useServerInvalidationContextInner } from './ServerInvalidationContext';

export function useServerInvalidationContext() {
  const { setPendingInvalidations } = useServerInvalidationContextInner();

  const RefreshServerPhotos = useCallback(() => {
    setPendingInvalidations(p => {
      if (!p.find(invalidation => invalidation.name == 'PhotosInvalidateAll')) {
        return [...p, { name: 'PhotosInvalidateAll' }];
      }
      return p;
    });
  }, [setPendingInvalidations]);

  const InvalidatePhotos = useCallback(
    (data: { serverIds: string[] }) => {
      setPendingInvalidations(p => {
        return [...p, { name: 'PhotosInvalidated', payload: data }];
      });
    },
    [setPendingInvalidations],
  );

  const InvalidatePhotosByMediaId = useCallback(
    (data: { mediaIds: string[] }) => {
      setPendingInvalidations(p => {
        return [...p, { name: 'PhotosInvalidatedByMediaId', payload: data }];
      });
    },
    [setPendingInvalidations],
  );

  return { RefreshServerPhotos, InvalidatePhotos, InvalidatePhotosByMediaId };
}
