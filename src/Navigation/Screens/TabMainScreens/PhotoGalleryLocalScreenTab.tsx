import React, { useCallback, useEffect, useState } from 'react';
import { Text } from 'react-native';

import PhotoGallery from '~/Components/PhotoComponents/PhotoGallery';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import * as AndroidPermissions from '~/Helpers/GetPermissionsAndroid';

export default function PhotoGalleryLocalScreenTab() {
  //console.log('render screen local');
  const [hasPermissions, setHasPermissions] = useState<boolean>(true);

  const photos = useAppSelector(state => state.photos.photosGallery);
  const photosLocal = useAppSelector(state => state.photos.photosLocal);
  const photosServer = useAppSelector(state => state.photos.photosServer);

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
        <PhotoGallery photos={photos} serverPhotos={photosServer} localPhotos={photosLocal} />
      ) : (
        <Text>Permissions needed</Text>
      )}
    </>
  );
}
