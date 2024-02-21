import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { areDatesTheSameDay, formatDate, withoutTime } from '~/Helpers/Date';
import { clamp } from '~/Helpers/Utilities';

import { SectionType } from '../../CommonComponents/SectionListWithColumns/Types';

export type SectionDataType = { title: string; day: string };
export type SectionTypePhotoGrid = SectionType<PhotoGalleryType, SectionDataType>;

export function getSectionIndex(
  currentPhoto: PhotoGalleryType,
  sections: SectionTypePhotoGrid[],
) {
  const currentPhotoDate = withoutTime(currentPhoto.date);
  const sectionIndex = sections.findIndex(e => e.sectionData.day === currentPhotoDate);
  return sectionIndex;
}

export function getIndexInSectionList(
  currentPhotoIndex: number,
  sections: SectionTypePhotoGrid[],
  photos: PhotoGalleryType[],
) {
  const currentPhotoIndexClamped = clamp(currentPhotoIndex, photos.length - 1);
  const currentPhoto = photos[currentPhotoIndexClamped];
  const sectionIndex = getSectionIndex(currentPhoto, sections);
  const itemIndex = sections[sectionIndex].data.findIndex(e => e.key === currentPhoto.key);

  return {
    sectionIndex,
    itemIndex,
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

      if (areDatesTheSameDay(photoDate, currentDate)) {
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
