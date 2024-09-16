import { useCallback } from 'react';

import { useServerQueriesContextInner } from './ServerQueriesContext';

export function useServerQueriesContext() {
  const { setPendingMutations } = useServerQueriesContextInner();

  const RefreshServerPhotos = useCallback(() => {
    setPendingMutations(p => {
      if (!p.find(mutation => mutation.name == 'PhotosChangedAll')) {
        return [...p, { name: 'PhotosChangedAll' }];
      }
      return p;
    });
  }, [setPendingMutations]);

  const UploadServerPhotos = useCallback(
    (mediaIds: string[]) => {
      setPendingMutations(p => {
        return [...p, { name: 'PhotosUploaded', payload: { mediaIds } }];
      });
    },
    [setPendingMutations],
  );

  return { RefreshServerPhotos, UploadServerPhotos };
}
