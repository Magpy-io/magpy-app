import {
  PhotoGalleryType,
  PhotoLocalType,
  PhotoServerType,
  PhotosLocalType,
  PhotosServerType,
} from '~/Context/ReduxStore/Slices/Photos/Photos';

const fileSize = 3415968;
const height = 3840;
const width = 2160;

const defaultDate = '2024-02-03T12:30:00.000Z';
export function makeGalleryPhoto(options?: {
  date?: string;
  mediaId?: string;
  serverId?: string;
}): PhotoGalleryType {
  return {
    key: options?.mediaId ?? 'mediaId',
    date: options?.date ?? defaultDate,
    mediaId: options?.mediaId ?? 'mediaId',
    serverId: options?.serverId,
  };
}

export function makeNGalleryPhotos(
  numberPhotos: number,
  options?: { mediaId?: string; differentDates?: boolean; startingDate?: string },
): PhotoGalleryType[] {
  const photos = new Array(numberPhotos).fill(undefined);

  return photos.map((_, index) => {
    const newDate = new Date(options?.startingDate ?? defaultDate);

    if (options?.differentDates) {
      newDate.setDate(newDate.getDate() - index);
    }

    return makeGalleryPhoto({
      mediaId: (options?.mediaId ?? 'mediaId') + index.toString(),
      date: newDate.toISOString(),
    });
  });
}

export function makeLocalPhoto(options?: { date?: string; mediaId?: string }): PhotoLocalType {
  return {
    id: options?.mediaId ?? 'mediaId',
    fileName: 'photo.jpg',
    fileSize,
    height,
    width,
    date: options?.date ?? defaultDate,
    uri: 'uri',
    group_name: [],
    type: 'image/jpeg',
  };
}

export function makeNLocalPhotos(
  numberPhotos: number,
  options?: { mediaId?: string; differentDates?: boolean; startingDate?: string },
): PhotoLocalType[] {
  const photos = new Array(numberPhotos).fill(undefined);

  return photos.map((_, index) => {
    const newDate = new Date(options?.startingDate ?? defaultDate);
    if (options?.differentDates) {
      newDate.setDate(newDate.getDate() - index);
    }

    return makeLocalPhoto({
      mediaId: (options?.mediaId ?? 'mediaId') + index.toString(),
      date: newDate.toISOString(),
    });
  });
}

export function makePhotosLocalFromPhotosArray(photos: PhotoLocalType[]): PhotosLocalType {
  return photos.reduce((a: PhotosLocalType, b) => {
    a[b.id] = b;
    return a;
  }, {});
}

export function makeServerPhoto(options?: {
  date?: string;
  serverId?: string;
  mediaId?: string;
}): PhotoServerType {
  return {
    id: options?.serverId ?? 'serverId',
    fileName: 'photo.jpg',
    fileSize,
    height,
    width,
    date: options?.date ?? defaultDate,
    syncDate: defaultDate,
    mediaId: options?.mediaId ?? 'mediaIdForServerPhoto',
    uriThumbnail: '',
    uriCompressed: '',
  };
}

export function makeNServerPhotos(
  numberPhotos: number,
  options?: { serverId?: string; differentDates?: boolean; startingDate?: string },
): PhotoServerType[] {
  const photos = new Array(numberPhotos).fill(undefined);

  return photos.map((_, index) => {
    const newDate = new Date(options?.startingDate ?? defaultDate);
    if (options?.differentDates) {
      newDate.setDate(newDate.getDate() - index);
    }

    return makeServerPhoto({
      serverId: (options?.serverId ?? 'serverId') + index.toString(),
      date: newDate.toISOString(),
    });
  });
}

export function makePhotosServerFromPhotosArray(photos: PhotoServerType[]): PhotosServerType {
  return photos.reduce((a: PhotosServerType, b) => {
    a[b.id] = b;
    return a;
  }, {});
}
