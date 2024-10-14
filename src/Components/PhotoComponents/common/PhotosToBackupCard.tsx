import React, { useMemo, useState } from 'react';

import { GenericCard } from '~/Components/CommonComponents/GenericCard';
import { UploadIcon } from '~/Components/CommonComponents/Icons';
import { photosGallerySelector } from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';

export function PhotosToBackupCard() {
  const photos = useAppSelector(photosGallerySelector);

  const unbackedPhotosCount = useMemo(() => {
    return photos.filter(photo => !photo.serverId).length;
  }, [photos]);

  const [showCard, setShowCard] = useState(true);

  return (
    showCard && (
      <GenericCard
        icon={<UploadIcon />}
        title={'Some Photos can be backed up'}
        text={`You have ${unbackedPhotosCount} photos that can be backed up. Back them now so you don't lose them.`}
        buttonOk={'Back up'}
        onButtonOk={() => {}}
        hasCloseButton
        onCloseButton={() => {
          setShowCard(false);
        }}
      />
    )
  );
}
