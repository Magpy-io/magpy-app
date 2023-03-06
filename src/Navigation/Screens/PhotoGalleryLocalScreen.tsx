import React, { useState, useEffect, useCallback } from "react";
import * as AndroidPermissions from "~/Helpers/GetPermissionsAndroid";
import { PhotoIdentifier } from "@react-native-camera-roll/camera-roll";

import { Text } from "react-native";
import PhotoGallery from "~/Components/PhotoGallery";

import { GetPhotos } from "~/Helpers/GetGalleryPhotos";
import { PhotoType } from "~/Helpers/types";
import * as Queries from "~/Helpers/Queries";

type PhotoGalleryProps = {};

export default function PhotoGalleryLocalScreen(props: PhotoGalleryProps) {
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

    const photosNotInServer = photosFromDevice.edges.filter((edge, index) => {
      return !photosExistInServer[index].exists;
    });

    const photos = photosNotInServer.map((edge, index) => {
      const photo = edge.node;
      const photoObject: PhotoType = {
        inDevice: true,
        inServer: false,
        image: {
          fileSize: photo.image.fileSize ?? 0,
          fileName: photo.image.filename ?? "",
          height: photo.image.height,
          width: photo.image.width,
          path: photo.image.uri,
          image64: "",
          image64Full: "",
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
  console.log("Render PhotoGalleryLocalScreen");

  return hasPermissions ? (
    <PhotoGallery loadMore={GetMorePhotos} />
  ) : (
    <Text>Permissions needed</Text>
  );
}
