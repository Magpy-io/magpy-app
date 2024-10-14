import React, { useEffect } from 'react';

import PhotoGallery from '~/Components/PhotoComponents/PhotoGallery';
import { PhotoGalleryContextProvider } from '~/Components/PhotoComponents/PhotoGalleryContext';
import { PhotosToBackupCard } from '~/Components/PhotoComponents/common/PhotosToBackupCard';
import PermissionNeededView from '~/Components/PhotoComponents/permissionNeeded/PermissionNeededView';
import { usePermissionsContext } from '~/Context/Contexts/PermissionsContext';

export default function HomeScreenTab() {
  const { mediaPermissionStatus, askMediaPermission } = usePermissionsContext();

  useEffect(() => {
    if (mediaPermissionStatus == 'PENDING') {
      askMediaPermission().catch(console.log);
    }
  }, [askMediaPermission, mediaPermissionStatus]);

  return (
    <>
      {mediaPermissionStatus != 'REJECTED' ? (
        <PhotoGalleryContextProvider isServer={false}>
          <PhotoGallery
            key={'AllPhotos'}
            title="All photos"
            isInTabScreen
            cardComponent={<PhotosToBackupCard />}
          />
        </PhotoGalleryContextProvider>
      ) : (
        <PermissionNeededView />
      )}
    </>
  );
}
