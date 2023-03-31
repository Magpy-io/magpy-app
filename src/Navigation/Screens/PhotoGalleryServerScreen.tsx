import PhotoGallery from "~/Components/PhotoGallery";

import { useMainContext } from "~/Components/ContextProvider";
import { useEffect } from "react";

function photosNbToString(n: number) {
  if (!n) {
    return "No backed up photos";
  }
  if (n == 1) {
    return "1 Photo in server";
  }
  return `${n} Photos in server`;
}

type PropsType = {};

export default function PhotoGalleryScreen(props: PropsType) {
  const context = useMainContext();

  return (
    <PhotoGallery
      photos={context.photosServer}
      onRefresh={context.onRefreshServer}
      contextLocation={"server"}
      RequestFullPhoto={context.RequestFullPhotoServer}
      addPhotosLocal={context.addPhotosLocal}
      addPhotosServer={context.addPhotosServer}
      deletePhotosLocal={context.deletePhotosLocalFromServer}
      deletePhotoLocal={context.deletePhotoLocalFromServer}
      deletePhotosServer={context.deletePhotosServer}
      gridHeaderTextFunction={photosNbToString}
    />
  );
}
