import React, { useState, useEffect, useCallback } from "react";
import * as AndroidPermissions from "~/Helpers/GetPermissionsAndroid";

import { Text } from "react-native";
import PhotoGallery from "~/Components/PhotoGallery";

import { useMainContext } from "~/Components/ContextProvider";

type PropsType = {};

export default function PhotoGalleryLocalScreen(props: PropsType) {
  const [hasPermissions, setHasPermissions] = useState<boolean>(true);
  const context = useMainContext();

  let getPermissions = useCallback(async () => {
    const hasPerm =
      await AndroidPermissions.hasAndroidPermissionWriteExternalStorage();
    if (!hasPerm) {
      setHasPermissions(hasPerm);
    }
  }, []);

  useEffect(() => {
    getPermissions();
  }, []);

  return hasPermissions ? (
    <PhotoGallery
      photos={context.photosLocal}
      onRefresh={context.onRefreshLocal}
      RequestFullPhoto={context.RequestFullPhotoServer}
      addPhotoLocal={context.addPhotoLocal}
      addPhotoServer={context.addPhotoServer}
      deletePhotoLocal={context.deletePhotoLocalFromLocal}
      deletePhotoServer={context.deletePhotoServer}
    />
  ) : (
    <Text>Permissions needed</Text>
  );
}
