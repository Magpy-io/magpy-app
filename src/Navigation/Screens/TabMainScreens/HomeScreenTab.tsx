import React, { useCallback, useEffect, useState } from 'react';
import { Text } from 'react-native';

import PhotoGallery from '~/Components/PhotoComponents/PhotoGallery';
import {
  photosGallerySelector,
  photosLocalSelector,
  photosServerSelector,
} from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import * as AndroidPermissions from '~/Helpers/GetPermissionsAndroid';

export default function HomeScreenTab() {
  const [hasPermissions, setHasPermissions] = useState<boolean>(true);

  const photos = useAppSelector(photosGallerySelector);
  const photosLocal = useAppSelector(photosLocalSelector);
  const photosServer = useAppSelector(photosServerSelector);

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
        <PhotoGallery
          key={'AllPhotos'}
          photos={photos}
          serverPhotos={photosServer}
          localPhotos={photosLocal}
          title="All photos"
          isInTabScreen
        />
      ) : (
        <Text>Permissions needed</Text>
      )}
    </>
  );
}
