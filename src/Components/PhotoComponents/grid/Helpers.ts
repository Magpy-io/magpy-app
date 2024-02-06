import {
  PhotoGalleryType,
  PhotosLocalType,
  PhotosServerType,
} from '~/Context/ReduxStore/Slices/Photos';
import { areDatesEqual, formatDate, withoutTime } from '~/Helpers/Date';

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

export function getClosestPhotoToIndex(currentPhotoIndex: number, photos: PhotoGalleryType[]) {
  const len = photos.length;
  if (currentPhotoIndex >= len) {
    return photos[len - 1];
  }
  if (currentPhotoIndex < 0) {
    return photos[0];
  }
  return photos[currentPhotoIndex];
}

export type DayType = {
  title: string;
  day: string;
  data: PhotoGalleryType[];
};

export function getIndexInSectionList(
  currentPhotoIndex: number,
  photosPerDayMemo: DayType[],
  localPhotos: PhotosLocalType,
  serverPhotos: PhotosServerType,
  photos: PhotoGalleryType[],
  columns: number,
) {
  const currentPhoto = getClosestPhotoToIndex(currentPhotoIndex, photos);
  const currentPhotoData = getPhotoServerOrLocal(localPhotos, serverPhotos, currentPhoto);
  const currentPhotoDate = withoutTime(currentPhotoData.created);
  const sectionIndex = photosPerDayMemo.findIndex(e => e.day === currentPhotoDate);

  const itemIndex = photosPerDayMemo[sectionIndex]?.data.findIndex(
    e => e.key === currentPhoto.key,
  );
  const rowIndex = Math.floor(itemIndex / columns);
  return {
    sectionIndex: sectionIndex,
    rowIndex: rowIndex,
  };
}

export function getPhotosPerDay(
  photos: PhotoGalleryType[],
  localPhotos: PhotosLocalType,
  serverPhotos: PhotosServerType,
) {
  if (photos && photos.length > 0) {
    const photosPerDay: DayType[] = [];
    const firstPhoto = getPhotoServerOrLocal(localPhotos, serverPhotos, photos[0]);
    let currentDate = withoutTime(firstPhoto?.created) ?? '';
    let currentBasket: DayType = {
      title: formatDate(currentDate),
      day: currentDate,
      data: [],
    };

    photos.forEach(photo => {
      const photoData = getPhotoServerOrLocal(localPhotos, serverPhotos, photo);
      const photoDate = withoutTime(photoData.created) ?? '';

      if (areDatesEqual(photoDate, currentDate)) {
        currentBasket.data.push(photo);
      } else {
        photosPerDay.push(currentBasket);
        currentDate = photoDate;
        currentBasket = {
          title: formatDate(photoDate),
          day: photoDate,
          data: [photo],
        };
      }
    });
    photosPerDay.push(currentBasket);
    return photosPerDay;
  } else {
    return [];
  }
}
