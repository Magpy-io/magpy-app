import { PhotoGalleryType, PhotosState } from './Photos';

export function mergePhotos(photosState: PhotosState): PhotoGalleryType[] {
  let localIndex = 0;
  let serverIndex = 0;

  const { photosLocal, photosLocalIdsOrdered, photosServer, photosServerIdsOrdered } =
    photosState;

  const galleryPhotos: PhotoGalleryType[] = [];

  while (
    localIndex < photosLocalIdsOrdered.length ||
    serverIndex < photosServerIdsOrdered.length
  ) {
    const photoLocal = photosLocal[photosLocalIdsOrdered[localIndex]];
    const photoServer = photosServer[photosServerIdsOrdered[serverIndex]];

    const diff = compareDates(photoLocal?.created, photoServer?.created);

    if (
      diff == 0 &&
      photoLocal.fileSize == photoServer.fileSize &&
      photoLocal.uri == photoServer.uri
    ) {
      galleryPhotos.push({
        key: photoServer.id,
        serverId: photoServer.id,
        mediaId: photoLocal.id,
      });
      localIndex += 1;
      serverIndex += 1;
      continue;
    }

    if (diff >= 0) {
      galleryPhotos.push({
        key: photoLocal.id,
        serverId: undefined,
        mediaId: photoLocal.id,
      });
      localIndex += 1;
    } else {
      galleryPhotos.push({
        key: photoServer.id,
        serverId: photoServer.id,
        mediaId: undefined,
      });
      serverIndex += 1;
    }
  }

  return galleryPhotos;
}

export function compareDates(date1: string, date2: string) {
  const d1 = Date.parse(date1);
  const d2 = Date.parse(date2);

  if (!d2) {
    return 1;
  }

  if (!d1) {
    return -1;
  }

  if (d1 > d2) {
    return 1;
  } else if (d1 < d2) {
    return -1;
  } else {
    return 0;
  }
}

export function insertPhotoKeyWithOrder<T extends { id: string; created: string }>(
  photos: { [key: string]: T },
  photosIdsOrdered: string[],
  photo: T,
) {
  const insertIndex = photosIdsOrdered.findIndex(
    p => compareDates(photos[p].created, photo.created) <= 0,
  );
  if (insertIndex == -1) {
    photosIdsOrdered.push(photo.id);
  } else {
    photosIdsOrdered.splice(insertIndex, 0, photo.id);
  }
}
