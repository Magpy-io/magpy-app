import React, { useEffect, useMemo, useState } from 'react';

import { GenericCard } from '~/Components/CommonComponents/GenericCard';
import { UploadIcon } from '~/Components/CommonComponents/Icons';
import { useServerInvalidationContext } from '~/Context/Contexts/ServerInvalidationContext';
import {
  photosGallerySelector,
  photosLocalSelector,
} from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import { useHasValueChanged } from '~/Hooks/useHasValueChanged';

import { useActionUploadPhotos } from './Actions/useActionUploadPhotos';

export function PhotosToBackupCard() {
  const photos = useAppSelector(photosGallerySelector);

  const localPhotos = useAppSelector(photosLocalSelector);

  const { UploadPhotosAction } = useActionUploadPhotos();

  const { isRefreshing } = useServerInvalidationContext();

  const hasRefreshingStatusChanged = useHasValueChanged(isRefreshing, false);

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

  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    if (!isRefreshing && hasRefreshingStatusChanged && unbackedPhotos.length != 0) {
      setShowCard(true);
    }
    if (isRefreshing || unbackedPhotos.length == 0) {
      setShowCard(false);
    }
  }, [hasRefreshingStatusChanged, isRefreshing, unbackedPhotos]);

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
          setShowCard(false);
        }}
      />
    )
  );
}
