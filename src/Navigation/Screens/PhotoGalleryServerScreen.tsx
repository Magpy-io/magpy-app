import PhotoGallery from "~/Components/PhotoGallery";

import { useMainContext } from "~/Components/ContextProvider";

type PropsType = {};

export default function PhotoGalleryScreen(props: PropsType) {
  const context = useMainContext();
  return (
    <PhotoGallery
      photos={context.photosServer}
      onRefresh={context.onRefreshServer}
      RequestFullPhoto={context.RequestFullPhotoServer}
      addPhotoLocal={context.addPhotoLocal}
      addPhotoServer={context.addPhotoServer}
      deletePhotoLocal={context.deletePhotoLocalFromServer}
      deletePhotoServer={context.deletePhotoServer}
    />
  );
}
