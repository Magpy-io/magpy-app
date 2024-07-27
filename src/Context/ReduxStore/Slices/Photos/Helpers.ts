// The same photo can have different dates in photosLocal and photosServer
// See https://trello.com/c/wH97h64t/44-get-date-from-exif-data-for-local-photos
import { compareDates } from '~/Helpers/DateFunctions/DateFunctions';

import { PhotoGalleryType, PhotosLocalType, PhotosServerType } from './Photos';

export function mergePhotos(photosState: {
  photosServer: PhotosServerType;
  photosServerIdsOrdered: string[];
  photosLocal: PhotosLocalType;
  photosLocalIdsOrdered: string[];
}): PhotoGalleryType[] {
  const { photosLocal, photosLocalIdsOrdered, photosServer, photosServerIdsOrdered } =
    photosState;

  const photosServerGallery: PhotoGalleryType[] = [];
  const photosLocalGallery: PhotoGalleryType[] = [];

  for (const photoServerId of photosServerIdsOrdered) {
    const photoServer = photosServer[photoServerId];

    const photoLocalAssociatedId = photosLocal[photoServer.mediaId ?? ''];

    if (photoLocalAssociatedId) {
      photosServerGallery.push({
        key: photoServerId,
        date: photoServer.date,
        serverId: photoServerId,
        mediaId: photoServer.mediaId,
      });
    } else {
      photosServerGallery.push({
        key: photoServerId,
        date: photoServer.date,
        serverId: photoServerId,
        mediaId: undefined,
      });
    }
  }

  for (const photoLocalId of photosLocalIdsOrdered) {
    const mergedWithServerPhoto = photosServerGallery.find(
      photoServerGallery => photoServerGallery.mediaId == photoLocalId,
    );

    if (!mergedWithServerPhoto) {
      photosLocalGallery.push({
        key: photoLocalId,
        date: photosLocal[photoLocalId].date,
        serverId: undefined,
        mediaId: photoLocalId,
      });
    }
  }

  const galleryPhotos: PhotoGalleryType[] = [];

  let localIndex = 0;
  let serverIndex = 0;

  while (localIndex < photosLocalGallery.length || serverIndex < photosServerGallery.length) {
    const diff = compareDates(
      photosLocalGallery[localIndex]?.date,
      photosServerGallery[serverIndex]?.date,
    );

    if (diff >= 0) {
      galleryPhotos.push(photosLocalGallery[localIndex]);
      localIndex += 1;
    } else {
      galleryPhotos.push(photosServerGallery[serverIndex]);
      serverIndex += 1;
    }
  }
  return galleryPhotos;
}

export function insertPhotoKeyWithOrder(
  photos: { [key: string]: { id: string; date: string } },
  photosIdsOrdered: string[],
  photo: { id: string; date: string },
) {
  const insertIndex = photosIdsOrdered.findIndex(
    p => compareDates(photos[p].date, photo.date) <= 0,
  );
  if (insertIndex == -1) {
    photosIdsOrdered.push(photo.id);
  } else {
    photosIdsOrdered.splice(insertIndex, 0, photo.id);
  }
}
