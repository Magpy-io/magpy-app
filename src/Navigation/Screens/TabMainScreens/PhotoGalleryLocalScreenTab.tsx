import React, { useCallback, useEffect, useState } from 'react';
import { Text } from 'react-native';

import PhotoGallery from '~/Components/PhotoComponents/PhotoGallery';
import { usePhotosContext } from '~/Context/UseContexts/usePhotosContext';
import * as AndroidPermissions from '~/Helpers/GetPermissionsAndroid';

function photosNbToString(n: number) {
  if (!n) {
    return 'All media is backed up.';
  }
  if (n == 1) {
    return '1 Photo ready for backup.';
  }
  return `${n} Photos ready for backup.`;
}

export default function PhotoGalleryLocalScreenTab() {
  console.log('render screen local');
  const [hasPermissions, setHasPermissions] = useState<boolean>(true);
  const { photosState } = usePhotosContext();

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
          style={{}}
          photos={photosState.photosLocal}
          key={'gallery_local'}
          contextLocation={'local'}
          gridHeaderTextFunction={photosNbToString}
        />
      ) : (
        <Text>Permissions needed</Text>
      )}
    </>
  );
}
