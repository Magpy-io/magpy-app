import React, { useState, useEffect } from "react";

import PhotoGrid from "./PhotoGrid";

type PhotoGalleryProps = {};

export default function PhotoGallery(props: PhotoGalleryProps) {
  const [uris, setUris] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://192.168.0.21:8000/photos")
      .then((r) => r.json())
      .then((json) => {
        return Promise.all(
          json.photos.map((id: string) => {
            return fetch("http://192.168.0.21:8000/photo/" + id);
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

  const title = "Mes photos";
  return <PhotoGrid uris={uris} title={title} />;
}
