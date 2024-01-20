import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { useMainContext } from '~/Components/ContextProvider';
import PhotoGallery from '~/Components/PhotoGallery';
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

type PropsType = {};

export default function PhotoGalleryLocalScreen(props: PropsType) {
  console.log('render screen local');
  const [hasPermissions, setHasPermissions] = useState<boolean>(true);
  const context = useMainContext();

  const getPermissions = useCallback(async () => {
    const hasPerm = await AndroidPermissions.hasAndroidPermissionWriteExternalStorage();
    if (!hasPerm) {
      setHasPermissions(hasPerm);
    }
  }, []);

  useEffect(() => {
    getPermissions();
  }, []);

  return hasPermissions ? (
    <PhotoGallery
      style={{}}
      photos={context.photosLocal}
      key={'gallery_local'}
      contextLocation={'local'}
      gridHeaderTextFunction={photosNbToString}
    />
  ) : (
    <Text>Permissions needed</Text>
  );
}

const styles = StyleSheet.create({
  viewHeader: { paddingVertical: 30 },
  textHeader: { fontSize: 17, textAlign: 'center' },
});
