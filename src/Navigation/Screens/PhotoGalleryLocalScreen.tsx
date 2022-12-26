import React, { useState, useEffect } from "react";
import * as AndroidPermissions from "~/Helpers/GetPermissionsAndroid";
import { PhotoIdentifier } from "@react-native-camera-roll/camera-roll";
import RNFS from "react-native-fs";

import { Text } from "react-native";
import PhotoGrid from "~/Components/PhotoGrid";

import GetPhotos from "~/Helpers/GetGalleryPhotos";
import { postPhoto } from "~/Helpers/Queries";
import { PhotoType } from "~/Helpers/types";
import * as Queries from "~/Helpers/Queries";

type PhotoGalleryProps = {};

export default function PhotoGalleryLocalScreen(props: PhotoGalleryProps) {
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);

  useEffect(() => {
    let getPermissions = async () => {
      const hasPermission =
        await AndroidPermissions.hasAndroidPermissionWriteExternalStorage();
      setHasPermissions(hasPermission);
    };
    getPermissions();
  }, []);

  async function GetMorePhotos(n: number, offset: number) {
    let foundAnyPhotoNotInServer = false;
    let photosFromDevice = {
      edges: new Array<PhotoIdentifier>(),
      endReached: false,
    };
    let photosExistInServer: Array<{
      exists: boolean;
      path: string;
      photo: any;
    }>;

    let totalOffset = offset;

    while (!foundAnyPhotoNotInServer && !photosFromDevice.endReached) {
      photosFromDevice = await GetPhotos(n, totalOffset);

      photosExistInServer = (
        await Queries.getPhotosExist(
          photosFromDevice.edges.map((edge) => edge.node.image.uri)
        )
      ).data.photosExist;

      if (
        photosExistInServer.length != 0 &&
        photosExistInServer.every((v) => v.exists)
      ) {
        totalOffset += n;
      } else {
        foundAnyPhotoNotInServer = true;
      }
    }

    if (!foundAnyPhotoNotInServer) {
      return { photos: [], nextOffset: n + totalOffset, endReached: true };
    }

    console.log(photosFromDevice.edges.length);

    const photosNotInServer = photosFromDevice.edges.filter((edge, index) => {
      return !photosExistInServer[index].exists;
    });

    const photos = photosNotInServer.map((edge, index) => {
      const photo = edge.node;
      const photoObject: PhotoType = {
        inDevice: true,
        inServer: photosExistInServer[index].exists,
        image: {
          fileSize: photo.image.fileSize ?? 0,
          fileName: photo.image.filename ?? "",
          height: photo.image.height,
          width: photo.image.width,
          path: photo.image.uri,
          image64: "",
        },
        id: photosExistInServer[index].exists
          ? photosExistInServer[index].photo.id
          : "",
        album: photo.group_name,
        created: new Date(photo.timestamp).toJSON(),
        modified: (photo as any).modified,
        syncDate: photosExistInServer[index].exists
          ? photosExistInServer[index].photo.syncDate
          : "",
        type: photo.type,
      };
      return photoObject;
    });

    return {
      photos: photos,
      nextOffset: n + totalOffset,
      endReached: photosFromDevice.endReached,
    };
  }

  function postPhotoMethod(photo: PhotoType) {
    RNFS.readFile(photo.image.path, "base64")
      .then((res: string) => {
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

  return hasPermissions ? (
    <PhotoGrid loadMore={GetMorePhotos} onPhotoClicked={postPhotoMethod} />
  ) : (
    <Text>Permissions needed</Text>
  );
}
