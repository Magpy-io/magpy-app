import React, { useCallback, useEffect, useState } from 'react';
import { Text } from 'react-native';

import PhotoGallery from '~/Components/PhotoComponents/PhotoGallery';
import { PhotoGalleryContextProvider } from '~/Components/PhotoComponents/PhotoGalleryContext';
import * as AndroidPermissions from '~/Helpers/GetPermissionsAndroid';

export default function HomeScreenTab() {
  const [hasPermissions, setHasPermissions] = useState<boolean>(true);

  const getPermissions = useCallback(async () => {
    const hasPerm = await AndroidPermissions.hasAndroidPermissionWriteExternalStorage();
    if (hasPerm) {
      setHasPermissions(hasPerm);
    }
  }, []);

  useEffect(() => {
    getPermissions().catch(e => {
      console.log('Error getting permissions', e);
    });
  }, [getPermissions]);

  return (
    <>
      {hasPermissions ? (
        <PhotoGalleryContextProvider isServer={false}>
          <PhotoGallery key={'AllPhotos'} title="All photos" isInTabScreen />
        </PhotoGalleryContextProvider>
      ) : (
        <Text>Permissions needed</Text>
      )}
    </>
  );
}
