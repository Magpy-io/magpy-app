import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, PixelRatio } from "react-native";

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
  const [isFs, setFs] = useState<boolean>(false);
  const context = useMainContext();

  const getPermissions = useCallback(async () => {
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
      onFullScreenChanged={(fs: boolean) => {
        setFs(fs);
      }}
      // style={{
      //   marginTop: isFs
      //     ? 50
      //     : PixelRatio.roundToNearestPixel(93 / PixelRatio.get()),
      //   marginBottom: isFs
      //     ? 50
      //     : PixelRatio.roundToNearestPixel(130 / PixelRatio.get()),
      // }}

      //style={{ marginTop: 0, marginBottom: 0 }}
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
