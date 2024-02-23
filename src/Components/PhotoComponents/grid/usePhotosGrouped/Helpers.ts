import { GroupType } from '~/Context/ReduxStore/Slices/GalleryOptions/GalleryOptions';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';

import { SectionDate } from './SectionDate';
import { SectionTypePhotoGrid } from './usePhotosGrouped';

export function getSectionIndex(
  currentPhoto: PhotoGalleryType,
  sections: SectionTypePhotoGrid[],
) {
  const sectionIndex = sections.findIndex(e => e.sectionData.includesDate(currentPhoto.date));
  return sectionIndex;
}

export function getIndexInSectionList(
  currentPhoto: PhotoGalleryType,
  sections: SectionTypePhotoGrid[],
) {
  const sectionIndex = getSectionIndex(currentPhoto, sections);
  if (sectionIndex < 0) {
    return { sectionIndex: sectionIndex, itemIndex: 0 };
  }
  const itemIndex = sections[sectionIndex].data.findIndex(e => e.key === currentPhoto.key);

  return {
    sectionIndex,
    itemIndex,
  };
}

export function getSectionsFromPhotos(
  photos: PhotoGalleryType[],
  groupType: GroupType,
): SectionTypePhotoGrid[] {
  if (photos && photos.length > 0) {
    const sections: SectionTypePhotoGrid[] = [];

    const sectionDate = new SectionDate(photos[0].date, groupType);

    let currentBasket: SectionTypePhotoGrid = {
      sectionData: sectionDate,
      data: [],
    };

    photos.forEach(photo => {
      if (currentBasket.sectionData.includesDate(photo.date)) {
        currentBasket.data.push(photo);
      } else {
        sections.push(currentBasket);
        const newSectionDate = new SectionDate(photo.date, groupType);
        currentBasket = {
          sectionData: newSectionDate,
          data: [photo],
        };
      }
    });
    sections.push(currentBasket);
    return sections;
  } else {
    return [];
  }
}

export function getGridNumberOfColumns(groupType: GroupType) {
  switch (groupType) {
    case 'Day':
      return 3;
    case 'Month':
      return 4;
    case 'Year':
      return 6;
    default:
      return 3;
  }
}
