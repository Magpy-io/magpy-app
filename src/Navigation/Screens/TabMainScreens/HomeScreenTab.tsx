import React, { useCallback, useEffect, useState } from 'react';
import { Text } from 'react-native';

import PhotoGallery from '~/Components/PhotoComponents/PhotoGallery';
import { selectGalleryPhotos } from '~/Context/ReduxStore/Slices/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';
import * as AndroidPermissions from '~/Helpers/GetPermissionsAndroid';

export default function HomeScreenTab() {
  //console.log('render screen local');
  const [hasPermissions, setHasPermissions] = useState<boolean>(true);

  const photos = useAppSelector(selectGalleryPhotos);
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
