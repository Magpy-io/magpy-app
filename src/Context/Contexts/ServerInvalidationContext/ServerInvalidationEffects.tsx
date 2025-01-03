import React, { ReactNode, useEffect } from 'react';

import { LOG } from '~/Helpers/Logging/Logger';
import { useToast } from '~/Hooks/useToast';

import { useServerInvalidationContextInner } from './ServerInvalidationContext';
import { useServerRequestsInner } from './useServerRequestsInner';

type PropsType = {
  children: ReactNode;
};

export const ServerInvalidationEffects: React.FC<PropsType> = props => {
  const {
    RefreshServerPhotosRequest,
    UpdatePhotoInfoRequest,
    UpdatePhotoInfoByMediaIdRequest,
  } = useServerRequestsInner();
  const {
    isFetchingRef,
    setFetchingStatus,
    setResultStatus,
    setIsRefreshing,
    setHasRefreshedOnce,
    pendingInvalidations,
    setPendingInvalidations,
  } = useServerInvalidationContextInner();

  const { showToastError } = useToast();

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
            setIsRefreshing(true);
            await RefreshServerPhotosRequest(5000);
            setHasRefreshedOnce(true);
          } else if (currentInvalidation.name == 'PhotosInvalidated') {
            await UpdatePhotoInfoRequest(currentInvalidation.payload);
          } else if (currentInvalidation.name == 'PhotosInvalidatedByMediaId') {
            await UpdatePhotoInfoByMediaIdRequest(currentInvalidation.payload);
          }

          setResultStatus('Success');
        } catch (e) {
          setResultStatus('Failed');
          throw e;
        }
      } finally {
        setPendingInvalidations(pm => {
          const [, ...remainingInvalidations] = pm;
          return remainingInvalidations;
        });
        isFetchingRef.current = false;
        setFetchingStatus('Idle');
        setIsRefreshing(false);
      }
    }

    innerAsync().catch(err => {
      showToastError('Failed fetching photos from server.');
      LOG.error(err);
    });
  }, [
    RefreshServerPhotosRequest,
    isFetchingRef,
    pendingInvalidations,
    setIsRefreshing,
    setHasRefreshedOnce,
    setFetchingStatus,
    setPendingInvalidations,
    setResultStatus,
    UpdatePhotoInfoRequest,
    UpdatePhotoInfoByMediaIdRequest,
    showToastError,
  ]);

  return props.children;
};
