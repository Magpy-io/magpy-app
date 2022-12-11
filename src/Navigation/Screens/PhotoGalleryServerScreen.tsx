import React, { useState, useEffect } from "react";

import PhotoGrid from "~/Components/PhotoGrid";

import * as Queries from "~/Helpers/Queries";

type PhotoGalleryProps = {};

export default function PhotoGalleryScreen(props: PhotoGalleryProps) {
  const [uris, setUris] = useState<string[]>([]);

  useEffect(() => {
    Queries.getPhotosJson()
      .then((json) => {
        return Promise.all(
          json.photos.map((id: string) => {
            return Queries.getPhoto(id);
          })
        );
      })
      .then((values) => {
        return Promise.all(
          values.map((v) => {
            return v.json();
          })
        );
      })
      .then((values) => {
        setUris(
          values.map((v: { image64: string }) => {
            return "data:image/jpg;base64," + v.image64;
          })
        );
      });
  });

  return <PhotoGrid uris={uris} />;
}
