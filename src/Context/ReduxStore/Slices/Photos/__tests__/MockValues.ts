import {
  PhotoGalleryType,
  PhotoLocalType,
  PhotosLocalType,
} from '~/Context/ReduxStore/Slices/Photos/Photos';

const fileSize = 3415968;
const height = 3840;
const width = 2160;

const defaultDate = '2024-02-03T12:30:00.000Z';
export function makeGalleryPhoto(options?: {
  date?: string;
  mediaId?: string;
}): PhotoGalleryType {
  return {
    key: options?.mediaId ?? 'mediaId',
    date: options?.date ?? defaultDate,
    mediaId: options?.mediaId ?? 'mediaId',
    serverId: undefined,
  };
}

export function makeNGalleryPhotosWithDifferentDates(
  numberPhotos: number,
  options?: { mediaId?: string },
): PhotoGalleryType[] {
  const photos = new Array(numberPhotos).fill(undefined);

  return photos.map((_, index) => {
    const newDate = new Date(defaultDate);
    newDate.setDate(newDate.getDate() - index);

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

export function makeNLocalPhotosWithDifferentDates(
  numberPhotos: number,
  options?: { mediaId?: string },
): PhotoLocalType[] {
  const photos = new Array(numberPhotos).fill(undefined);

  return photos.map((_, index) => {
    const newDate = new Date(defaultDate);
    newDate.setDate(newDate.getDate() - index);

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
