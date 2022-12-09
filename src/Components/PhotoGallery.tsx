import React, { useState, useEffect } from "react";

import * as AndroidPermissions from "~/Components/GetPermissionsAndroid";

import { GetPhotosUris } from "~/Components/GetGalleryPhotos";

import PhotoGrid from "./PhotoGrid";

type PhotoGalleryProps = {};

export default function PhotoGallery(props: PhotoGalleryProps) {
  const [uris, setUris] = useState<string[]>();

  async function getPermissionsThenGetPhotos() {
    if (
      !(await AndroidPermissions.hasAndroidPermissionWriteExternalStorage())
    ) {
      return;
    }

    GetPhotosUris(2000).then((r) => setUris(r));
  }

  useEffect(() => {
    getPermissionsThenGetPhotos();
  });

  const title = "Mes photos";
  return <PhotoGrid uris={uris} title={title} />;
}
