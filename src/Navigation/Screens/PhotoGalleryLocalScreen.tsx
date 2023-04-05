import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text } from "react-native";

import * as AndroidPermissions from "~/Helpers/GetPermissionsAndroid";

import PhotoGallery from "~/Components/PhotoGallery";
import { useMainContext } from "~/Components/ContextProvider";
import { PhotoType } from "~/Helpers/types";

function photosNbToString(n: number) {
  if (!n) {
    return "All media is backed up.";
  }
  if (n == 1) {
    return "1 Photo ready for backup.";
  }
  return `${n} Photos ready for backup.`;
}

type PropsType = {};

export default function PhotoGalleryLocalScreen(props: PropsType) {
  console.log("render screen local");
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
      key={"gallery_local"}
      contextLocation={"local"}
      RequestFullPhoto={context.RequestFullPhotoServer}
      addPhotosLocal={context.addPhotosLocal}
      addPhotosServer={context.addPhotosServer}
      deletePhotosLocal={context.deletePhotosLocalFromLocal}
      deletePhotoLocal={(photo: PhotoType) =>
        context.deletePhotosLocalFromLocal([photo])
      }
      deletePhotosServer={context.deletePhotosServer}
      gridHeaderTextFunction={photosNbToString}
    />
  ) : (
    <Text>Permissions needed</Text>
  );
}

const styles = StyleSheet.create({
  viewHeader: { paddingVertical: 30 },
  textHeader: { fontSize: 17, textAlign: "center" },
});
