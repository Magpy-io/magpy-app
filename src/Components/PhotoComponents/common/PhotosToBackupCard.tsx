import React, { useEffect, useMemo, useState } from 'react';

import { GenericCard } from '~/Components/CommonComponents/GenericCard';
import { UploadIcon } from '~/Components/CommonComponents/Icons';
import { useBackupWorkerContext } from '~/Context/Contexts/BackupWorkerContext';
import { useServerContext } from '~/Context/Contexts/ServerContext';
import { useServerInvalidationContext } from '~/Context/Contexts/ServerInvalidationContext';
import { useUploadWorkerContext } from '~/Context/Contexts/UploadWorkerContext';
import {
  photosGallerySelector,
  photosLocalSelector,
} from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';

import { useActionUploadPhotos } from './Actions/useActionUploadPhotos';

export function PhotosToBackupCard() {
  const photos = useAppSelector(photosGallerySelector);
  const localPhotos = useAppSelector(photosLocalSelector);

  const { autobackupEnabled } = useBackupWorkerContext();
  const { isServerReachable } = useServerContext();

  const { UploadPhotosAction } = useActionUploadPhotos();

  const { IsUploadRunning } = useUploadWorkerContext();

  const { isRefreshing, hasRefreshedOnce } = useServerInvalidationContext();

  const [showCard, setShowCard] = useState(false);
  const [closedShowCard, setClosedShowCard] = useState(false);

  const unbackedPhotos = useMemo(() => {
    const localOnlyPhotos = [];
    for (const photo of photos) {
      if (photo.serverId) {
        continue;
      }
      const localPhoto = photo.mediaId ? localPhotos[photo.mediaId] : undefined;
      if (localPhoto) {
        localOnlyPhotos.push(localPhoto);
      }
    }
    return localOnlyPhotos;
  }, [photos, localPhotos]);

  useEffect(() => {
    if (closedShowCard || autobackupEnabled || !isServerReachable || IsUploadRunning) {
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
    closedShowCard,
  ]);

  return (
    showCard && (
      <GenericCard
        icon={<UploadIcon />}
        title={'Some Photos can be backed up'}
        text={`You have ${unbackedPhotos.length} photos that can be backed up. Back them now so you don't lose them.`}
        buttonOk={'Back up'}
        onButtonOk={() => {
          UploadPhotosAction(unbackedPhotos);
          setShowCard(false);
        }}
        hasCloseButton
        onCloseButton={() => {
          setClosedShowCard(true);
        }}
      />
    )
  );
}
