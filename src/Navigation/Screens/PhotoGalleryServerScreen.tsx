import React, { useState, useEffect } from "react";

import PhotoGrid from "~/Components/PhotoGrid";

import * as Queries from "~/Helpers/Queries";
import { Photo as PhotoType } from "~/Helpers/types";

type PhotoGalleryProps = {};

export default function PhotoGalleryScreen(props: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  console.log("Render PhotoGalleryServerScreen");
  useEffect(() => {
    Queries.getPhotosJson(100, 0)
      .then((res) => {
        const photosObj = res.data.photos.map((photo) => {
          const photoObject: PhotoType = {
            inDevice: false,
            inServer: true,
            image: {
              fileSize: photo.meta.fileSize,
              fileName: photo.meta.name,
              height: photo.meta.height,
              width: photo.meta.width,
              path: photo.meta.clientPath,
              base64: `data:image/jpeg;base64,${photo.image64}`,
            },
            album: "",
            created: photo.meta.date,
            modified: "",
            syncDate: photo.meta.syncDate,
            type: "",
          };
          return photoObject;
        });
        setPhotos(photosObj);
      })
      .catch((err) => console.log(err));
  }, []);
  return <PhotoGrid photos={photos} />;
}
