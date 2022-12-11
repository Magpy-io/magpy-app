import React, { useState, useEffect } from "react";

import * as AndroidPermissions from "~/Helpers/GetPermissionsAndroid";

import GetPhotosUris from "~/Helpers/GetGalleryPhotos";

import PhotoGrid from "~/Components/PhotoGrid";

type PhotoGalleryProps = {};

export default function PhotoGalleryLocalScreen(props: PhotoGalleryProps) {
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

  return <PhotoGrid uris={uris} />;
}
