import React, { ReactNode, useEffect } from 'react';

import { useServerInvalidationContextInner } from './ServerInvalidationContext';
import { useServerRequestsInner } from './useServerRequestsInner';

type PropsType = {
  children: ReactNode;
};

export const ServerInvalidationEffects: React.FC<PropsType> = props => {
  const { RefreshServerPhotosRequest, UpdatePhotoInfoRequest } = useServerRequestsInner();
  const {
    isFetchingRef,
    setFetchingStatus,
    setResultStatus,
    pendingInvalidations,
    setPendingInvalidations,
  } = useServerInvalidationContextInner();

  useEffect(() => {
    async function innerAsync() {
      if (isFetchingRef.current) {
        return;
      }

      if (pendingInvalidations.length == 0) {
        return;
      }

      try {
        isFetchingRef.current = true;
        setFetchingStatus('Fetching');

        const [currentInvalidation] = pendingInvalidations;

        try {
          if (currentInvalidation.name == 'PhotosInvalidateAll') {
            await RefreshServerPhotosRequest(5000);
          } else if (currentInvalidation.name == 'PhotosInvalidated') {
            await UpdatePhotoInfoRequest(currentInvalidation.payload);
          }

          setResultStatus('Success');
        } catch (e) {
          setResultStatus('Failed');
          console.log(e);
        }
      } finally {
        setPendingInvalidations(pm => {
          const [, ...remainingInvalidations] = pm;
          return remainingInvalidations;
        });
        isFetchingRef.current = false;
        setFetchingStatus('Idle');
      }
    }

    innerAsync().catch(console.log);
  }, [
    RefreshServerPhotosRequest,
    isFetchingRef,
    pendingInvalidations,
    setFetchingStatus,
    setPendingInvalidations,
    setResultStatus,
    UpdatePhotoInfoRequest,
  ]);

  return props.children;
};
