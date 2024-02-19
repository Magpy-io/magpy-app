import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { areDatesEqual, formatDate, withoutTime } from '~/Helpers/Date';

import { SectionType } from './SectionListWithColumns';

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

export type SectionDataType = { title: string; day: string };

export type SectionTypePhotoGrid = SectionType<PhotoGalleryType, SectionDataType>;

export function getSectionIndex(
  currentPhoto: PhotoGalleryType,
  photosPerDayMemo: SectionTypePhotoGrid[],
) {
  const currentPhotoDate = withoutTime(currentPhoto.date);
  const sectionIndex = photosPerDayMemo.findIndex(
    e => e.sectionData?.day === currentPhotoDate,
  );
  return sectionIndex;
}

export function getIndexInSectionList(
  currentPhotoIndex: number,
  photosPerDayMemo: SectionTypePhotoGrid[],
  photos: PhotoGalleryType[],
  columns: number,
) {
  const currentPhoto = getClosestPhotoToIndex(currentPhotoIndex, photos);
  const sectionIndex = getSectionIndex(currentPhoto, photosPerDayMemo);
  const itemIndex = photosPerDayMemo[sectionIndex]?.data.findIndex(
    e => e.key === currentPhoto.key,
  );
  const rowIndex = Math.floor(itemIndex / columns);
  return {
    sectionIndex: sectionIndex,
    rowIndex: rowIndex,
  };
}

export function getPhotosPerDay(photos: PhotoGalleryType[]): SectionTypePhotoGrid[] {
  if (photos && photos.length > 0) {
    const photosPerDay: SectionTypePhotoGrid[] = [];
    let currentDate = withoutTime(photos[0].date) ?? '';
    let currentBasket: SectionTypePhotoGrid = {
      sectionData: { title: formatDate(currentDate), day: currentDate },
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
          sectionData: { title: formatDate(photoDate), day: photoDate },

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

// export function getPhotosPerMonth(photos: PhotoGalleryType[]) {
//   if (photos && photos.length > 0) {
//     const photosPerMonth: DayType[] = [];
//     let currentDate = photos[0].date ?? '';
//     let currentBasket: DayType = {
//       title: formatDate(currentDate),
//       day: currentDate,
//       data: [],
//     };

//     photos.forEach(photo => {
//       const photoDate = photo.date ?? '';

//       if (areDatesTheSameMonth(photoDate, currentDate)) {
//         currentBasket.data.push(photo);
//       } else {
//         photosPerMonth.push(currentBasket);
//         currentDate = photoDate;
//         currentBasket = {
//           title: formatDate(photoDate),
//           day: photoDate,
//           data: [photo],
//         };
//       }
//     });
//     photosPerMonth.push(currentBasket);
//     return photosPerMonth;
//   } else {
//     return [];
//   }
// }
