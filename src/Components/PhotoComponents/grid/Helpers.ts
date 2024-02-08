import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos';
import { areDatesEqual, formatDate, withoutTime } from '~/Helpers/Date';

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
  photos: PhotoGalleryType[],
  columns: number,
) {
  const currentPhoto = getClosestPhotoToIndex(currentPhotoIndex, photos);
  const currentPhotoDate = withoutTime(currentPhoto.date);
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

export function getPhotosPerDay(photos: PhotoGalleryType[]) {
  if (photos && photos.length > 0) {
    const photosPerDay: DayType[] = [];
    let currentDate = withoutTime(photos[0].date) ?? '';
    let currentBasket: DayType = {
      title: formatDate(currentDate),
      day: currentDate,
      data: [],
    };

    photos.forEach(photo => {
      const photoDate = withoutTime(photo.date) ?? '';

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
