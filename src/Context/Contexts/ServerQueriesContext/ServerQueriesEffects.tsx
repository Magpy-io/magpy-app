import React, { ReactNode, useEffect } from 'react';

import { useServerQueriesContextInner } from './ServerQueriesContext';
import { useServerRequestsInner } from './useServerRequestsInner';

type PropsType = {
  children: ReactNode;
};

export const ServerQueriesEffects: React.FC<PropsType> = props => {
  const { RefreshServerPhotosRequest, UpdatePhotoInfoRequest } = useServerRequestsInner();
  const {
    isFetchingRef,
    setFetchingStatus,
    setResultStatus,
    pendingMutations,
    setPendingMutations,
  } = useServerQueriesContextInner();

  useEffect(() => {
    async function innerAsync() {
      if (isFetchingRef.current) {
        return;
      }

      if (pendingMutations.length == 0) {
        return;
      }

      try {
        isFetchingRef.current = true;
        setFetchingStatus('Fetching');

        const [currentMutation] = pendingMutations;

        try {
          if (currentMutation.name == 'PhotosChangedAll') {
            await RefreshServerPhotosRequest(5000);
          } else if (currentMutation.name == 'PhotosInvalidated') {
            await UpdatePhotoInfoRequest(currentMutation.payload);
          }

          setResultStatus('Success');
        } catch (e) {
          setResultStatus('Failed');
          console.log(e);
        }
      } finally {
        setPendingMutations(pm => {
          const [, ...remainingMutations] = pm;
          return remainingMutations;
        });
        isFetchingRef.current = false;
        setFetchingStatus('Idle');
      }
    }

    innerAsync().catch(console.log);
  }, [
    RefreshServerPhotosRequest,
    isFetchingRef,
    pendingMutations,
    setFetchingStatus,
    setPendingMutations,
    setResultStatus,
    UpdatePhotoInfoRequest,
  ]);

  return props.children;
};