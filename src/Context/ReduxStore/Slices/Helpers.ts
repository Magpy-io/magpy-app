import { PhotoGalleryType, PhotosState } from './Photos';

// The same photo can have different dates in photosLocal and photosServer
// See https://trello.com/c/wH97h64t/44-get-date-from-exif-data-for-local-photos

export function mergePhotos(photosState: PhotosState): PhotoGalleryType[] {
  const { photosLocal, photosLocalIdsOrdered, photosServer, photosServerIdsOrdered } =
    photosState;

  const photosServerGallery: PhotoGalleryType[] = [];
  const photosLocalGallery: PhotoGalleryType[] = [];

  for (const photoServerId of photosServerIdsOrdered) {
    const photoServer = photosServer[photoServerId];

    if (!photoServer.uri) {
      photosServerGallery.push({
        key: photoServerId,
        date: photoServer.created,
        serverId: photoServerId,
        mediaId: undefined,
      });
      continue;
    }

    const photoLocalAssociatedId = photosLocalIdsOrdered.find(mediaId => {
      const photoLocal = photosLocal[mediaId];
      if (photoLocal.uri == photoServer.uri) {
        return true;
      }
      return false;
    });

    if (!photoLocalAssociatedId) {
      photosServerGallery.push({
        key: photoServerId,
        date: photoServer.created,
        serverId: photoServerId,
        mediaId: undefined,
      });
    } else {
      photosServerGallery.push({
        key: photoServerId,
        date: photoServer.created,
        serverId: photoServerId,
        mediaId: photoLocalAssociatedId,
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
        date: photosLocal[photoLocalId].created,
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
