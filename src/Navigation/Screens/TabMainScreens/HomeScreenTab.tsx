import React from 'react';

import PhotoGallery from '~/Components/PhotoComponents/PhotoGallery';
import { PhotoGalleryContextProvider } from '~/Components/PhotoComponents/PhotoGalleryContext';
import PermissionNeededView from '~/Components/PhotoComponents/permissionNeeded/PermissionNeededView';
import { usePermissionsContext } from '~/Context/Contexts/PermissionsContext';

export default function HomeScreenTab() {
  const { hasMediaPermission } = usePermissionsContext();

  return (
    <>
      {hasMediaPermission ? (
        <PhotoGalleryContextProvider isServer={false}>
          <PhotoGallery key={'AllPhotos'} title="All photos" isInTabScreen />
        </PhotoGalleryContextProvider>
      ) : (
        <PermissionNeededView />
      )}
    </>
  );
}
