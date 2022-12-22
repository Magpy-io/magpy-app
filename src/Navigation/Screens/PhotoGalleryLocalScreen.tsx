import React, { useState, useEffect } from "react";

import * as AndroidPermissions from "~/Helpers/GetPermissionsAndroid";

import GetPhotos from "~/Helpers/GetGalleryPhotos";

import PhotoGrid from "~/Components/PhotoGrid";

import RNFS from "react-native-fs";

import { postPhoto } from "~/Helpers/Queries";

type PhotoGalleryProps = {};

export default function PhotoGalleryLocalScreen(props: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    let getPermissionsThenGetPhotos = async () => {
      if (
        !(await AndroidPermissions.hasAndroidPermissionWriteExternalStorage())
      ) {
        return;
      }

      GetPhotos(100).then((r) => {
        setPhotos(r);
        console.log(r.length);
      });
    };
    getPermissionsThenGetPhotos();
  }, []);
  console.log("Render PhotoGalleryLocalScreen");
  return (
    <PhotoGrid
      uris={photos.map((photo) => {
        return { uri: photo.uri, url: "" };
      })}
      onPhotoClicked={(n) => {
        RNFS.readFile(photos[n].uri, "base64")
          .then((res: string) => {
            let photo = photos[n];
            postPhoto({
              name: photo.filename,
              fileSize: photo.fileSize,
              width: photo.width,
              height: photo.height,
              date: new Date(photo.timestamp).toJSON(),
              path: photo.uri,
              image64: res,
            });
          })
          .catch((err: any) => console.log(err));
      }}
    />
  );
}
