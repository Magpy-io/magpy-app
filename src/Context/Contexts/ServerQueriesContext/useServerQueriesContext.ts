import { useCallback } from 'react';

import { PhotoLocalType } from '~/Context/ReduxStore/Slices/Photos/Photos';

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

  const DownloadServerPhoto = useCallback(
    (data: { localPhoto: PhotoLocalType; serverId: string }) => {
      setPendingMutations(p => {
        return [...p, { name: 'PhotoDownloaded', payload: data }];
      });
    },
    [setPendingMutations],
  );

  const InvalidatePhotos = useCallback(
    (data: { serverIds: string[] }) => {
      setPendingMutations(p => {
        return [...p, { name: 'PhotosInvalidated', payload: data }];
      });
    },
    [setPendingMutations],
  );

  return { RefreshServerPhotos, UploadServerPhotos, DownloadServerPhoto, InvalidatePhotos };
}
