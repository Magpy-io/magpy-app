import React, { useState, useEffect, useCallback } from "react";
import * as AndroidPermissions from "~/Helpers/GetPermissionsAndroid";

import { Text } from "react-native";
import PhotoGallery from "~/Components/PhotoGallery";

type PropsType = {};

export default function PhotoGalleryLocalScreen(props: PropsType) {
  const [hasPermissions, setHasPermissions] = useState<boolean>(true);

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
    <PhotoGallery contextSource={"local"} />
  ) : (
    <Text>Permissions needed</Text>
  );
}
