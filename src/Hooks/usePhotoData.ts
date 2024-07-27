import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import {
  photoLocalSelector,
  photoServerSelector,
} from '~/Context/ReduxStore/Slices/Photos/Selectors';
import { useAppSelector } from '~/Context/ReduxStore/Store';

export default function usePhotoData(photo: PhotoGalleryType) {
  const localPhoto = useAppSelector(photoLocalSelector(photo.mediaId));
  const serverPhoto = useAppSelector(photoServerSelector(photo.serverId));

  const photoData = {
    inDevice: photo.mediaId != null,
    inServer: photo.serverId != null,
    fileName: serverPhoto?.fileName ?? localPhoto?.fileName,
    fileSize: serverPhoto?.fileSize ?? localPhoto?.fileSize,
    width: serverPhoto?.width ?? localPhoto?.width,
    height: serverPhoto?.height ?? localPhoto?.height,
    created: photo.date,
    devicePath: localPhoto?.uri,
  };
  return photoData;
}
