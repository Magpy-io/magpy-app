import PhotoGallery from "~/Components/PhotoGallery";

type PropsType = {};

export default function PhotoGalleryScreen(props: PropsType) {
  return <PhotoGallery contextSource={"server"} />;
}
