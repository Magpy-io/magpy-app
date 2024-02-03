import {
  PhotoGalleryType,
  PhotosLocalType,
  PhotosServerType,
} from '~/Context/ReduxStore/Slices/Photos';

export function getPhotoServerOrLocal(
  localPhotos: PhotosLocalType,
  serverPhotos: PhotosServerType,
  photo?: PhotoGalleryType,
) {
  const ret = photo?.mediaId
    ? localPhotos[photo?.mediaId]
    : serverPhotos[photo?.serverId ?? ''];
  if (!ret) {
    throw new Error(
      'getPhotoServerOrLocal: no such photo was found in localPhotos or serverPhotos',
    );
  }
  return ret;
}
