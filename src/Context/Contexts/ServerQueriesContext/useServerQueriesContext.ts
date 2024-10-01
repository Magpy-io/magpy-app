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

  const InvalidatePhotos = useCallback(
    (data: { serverIds: string[] }) => {
      setPendingMutations(p => {
        return [...p, { name: 'PhotosInvalidated', payload: data }];
      });
    },
    [setPendingMutations],
  );

  return { RefreshServerPhotos, InvalidatePhotos };
}
