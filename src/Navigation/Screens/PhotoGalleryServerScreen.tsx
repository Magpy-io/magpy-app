import React, { useState, useEffect } from "react";

import PhotoGrid from "~/Components/PhotoGrid";

import * as Queries from "~/Helpers/Queries";

type PhotoGalleryProps = {};

export default function PhotoGalleryScreen(props: PhotoGalleryProps) {
  const [uris, setUris] = useState<string[]>([]);
  console.log("Render PhotoGalleryServerScreen");
  useEffect(() => {
    Queries.getPhotosJson()
      .then((json) => {
        setUris(
          json.data.photos.map((photo: { image64: string }) => {
            return "data:image/jpg;base64," + photo.image64;
          })
        );
      })
      .catch((err) => console.log("error", err));
  }, []);
  return <PhotoGrid uris={[]} />;
}
