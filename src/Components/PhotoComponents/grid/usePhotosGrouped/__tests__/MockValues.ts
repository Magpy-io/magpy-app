import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';

const defaultDate = '2024-02-03T12:30:00.000Z';

export function makeGalleryPhoto(options?: {
  date?: string;
  mediaId?: string;
}): PhotoGalleryType {
  return {
    key: options?.mediaId ?? 'localId',
    date: options?.date ?? defaultDate,
    mediaId: options?.mediaId ?? 'localId',
    serverId: undefined,
  };
}

export function makeNGalleryPhotosWithDifferentDates(
  numberPhotos: number,
  options?: { mediaId?: string },
) {
  const photos = new Array(numberPhotos).fill(undefined);

  return photos.map((_, index) => {
    const newDate = new Date(defaultDate);
    newDate.setDate(newDate.getDate() - index);

    return makeGalleryPhoto({
      mediaId: (options?.mediaId ?? 'localId') + index.toString(),
      date: newDate.toISOString(),
    });
  });
}
