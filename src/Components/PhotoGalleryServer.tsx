import React, { useState, useEffect } from "react";

import PhotoGrid from "./PhotoGrid";

type PhotoGalleryProps = {};

export default function PhotoGallery(props: PhotoGalleryProps) {
  const [uris, setUris] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://192.168.0.21:8080/photo?id=1")
      .then((r) => {
        return r.json();
      })
      .then((json) => {
        setUris(new Array(100).fill(`data:image/jpg;base64,${json.image64}`));
      })
      .catch((e) => console.log(e));
  });

  const title = "Mes photos";
  return <PhotoGrid uris={uris} title={title} />;
}
