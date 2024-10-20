import React, { useEffect, useMemo, useState } from 'react';

import { GenericCard } from '~/Components/CommonComponents/GenericCard';
import { UploadIcon } from '~/Components/CommonComponents/Icons';
import { useBackupWorkerContext } from '~/Context/Contexts/BackupWorkerContext';
import { useServerContext } from '~/Context/Contexts/ServerContext';
import { useServerInvalidationContext } from '~/Context/Contexts/ServerInvalidationContext';
import { useUploadWorkerContext } from '~/Context/Contexts/UploadWorkerContext';
import { photosGallerySelector } from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';

import { useUserActions } from './Actions/useUserActions';

export function PhotosToBackupCard() {
  const photos = useAppSelector(photosGallerySelector);

  const { autobackupEnabled } = useBackupWorkerContext();
  const { isServerReachable } = useServerContext();

  const { UploadPhotosAction } = useUserActions();

  const { IsUploadRunning } = useUploadWorkerContext();

  const { isRefreshing, hasRefreshedOnce } = useServerInvalidationContext();

  const [showCard, setShowCard] = useState(false);
  const [closedCard, setClosedCard] = useState(false);

  const unbackedPhotos = useMemo(() => {
    return photos
      .filter(photo => photo.mediaId && !photo.serverId)
      .map(photo => photo.mediaId);
  }, [photos]) as string[];

  useEffect(() => {
    if (closedCard || autobackupEnabled || !isServerReachable || IsUploadRunning) {
      setShowCard(false);
      return;
    }

    if (!isRefreshing && hasRefreshedOnce && unbackedPhotos.length != 0) {
      setShowCard(true);
    }

    if (isRefreshing || unbackedPhotos.length == 0) {
      setShowCard(false);
    }
  }, [
    hasRefreshedOnce,
    isRefreshing,
    unbackedPhotos,
    autobackupEnabled,
    isServerReachable,
    IsUploadRunning,
    closedCard,
  ]);

  const photoString = unbackedPhotos.length == 1 ? 'photo' : 'photos';

  return (
    showCard && (
      <GenericCard
        icon={<UploadIcon />}
        title={'Some Photos can be backed up'}
        text={`You have ${unbackedPhotos.length} ${photoString} that can be backed up. Back them now so you don't lose them.`}
        buttonOk={'Back up'}
        onButtonOk={() => {
          UploadPhotosAction(unbackedPhotos);
        }}
        hasCloseButton
        onCloseButton={() => {
          setClosedCard(true);
        }}
      />
    )
  );
}
