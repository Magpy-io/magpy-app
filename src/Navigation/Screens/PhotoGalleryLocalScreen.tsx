import React, { useState, useEffect } from "react";
import * as AndroidPermissions from "~/Helpers/GetPermissionsAndroid";
import { PhotoIdentifier } from "@react-native-camera-roll/camera-roll";
import RNFS from "react-native-fs";

import PhotoGrid from "~/Components/PhotoGrid";

import GetPhotos from "~/Helpers/GetGalleryPhotos";
import { postPhoto } from "~/Helpers/Queries";
import { Photo as PhotoType } from "~/Helpers/types";

type PhotoGalleryProps = {};

export default function PhotoGalleryLocalScreen(props: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<PhotoType[]>([]);

  useEffect(() => {
    let getPermissionsThenGetPhotos = async () => {
      if (
        !(await AndroidPermissions.hasAndroidPermissionWriteExternalStorage())
      ) {
        return;
      }

      GetPhotos(100).then((cameraRollPhotos: PhotoIdentifier[]) => {
        const photosObj = cameraRollPhotos.map((edge) => {
          const photo = edge.node;
          const photoObject: PhotoType = {
            inDevice: true,
            inServer: null, //TODO, see if photo is in Server
            image: {
              fileSize: photo.image.fileSize ?? 0,
              fileName: photo.image.filename ?? "",
              height: photo.image.height,
              width: photo.image.width,
              path: photo.image.uri,
              base64: "",
            },
            album: photo.group_name,
            created: new Date(photo.timestamp).toJSON(),
            modified: photo.modified,
            syncDate: "",
            type: photo.type,
          };
          return photoObject;
        });
        setPhotos(photosObj);
      });
    };
    getPermissionsThenGetPhotos();
  }, []);

  function postPhotoMethod(n: number) {
    RNFS.readFile(photos[n].image.path, "base64")
      .then((res: string) => {
        let photo = photos[n];
        postPhoto({
          name: photo.image.fileName,
          fileSize: photo.image.fileSize,
          width: photo.image.width,
          height: photo.image.height,
          date: new Date(photo.created).toJSON(),
          path: photo.image.path,
          image64: res,
        });
      })
      .catch((err: any) => console.log(err));
  }

  console.log("Render PhotoGalleryLocalScreen");

  return <PhotoGrid photos={photos} onPhotoClicked={postPhotoMethod} />;
}
