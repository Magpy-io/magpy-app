import { GroupType } from '~/Context/ReduxStore/Slices/GalleryOptions/GalleryOptions';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { LOG } from '~/Helpers/Logging/Logger';

import { SectionDateFactory } from './SectionDate/SectionDateFactory';
import { SectionTypePhotoGrid } from './usePhotosGrouped';

export function getSectionIndex(
  currentPhoto: PhotoGalleryType,
  sections: SectionTypePhotoGrid[],
) {
  const sectionIndex = sections.findIndex(e => e.sectionData.includesDate(currentPhoto.date));
  if (sectionIndex < 0) {
    LOG.warn('getSectionIndex: section not found');
  }
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

  if (itemIndex < 0) {
    LOG.warn('getIndexInSectionList: item not found in section');
  }

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
    const sectionDateFactory = new SectionDateFactory();

    const sectionDateInitial = sectionDateFactory.createSectionDate(photos[0].date, groupType);

    let currentBasket: SectionTypePhotoGrid = {
      sectionData: sectionDateInitial,
      data: [],
    };

    photos.forEach(photo => {
      if (currentBasket.sectionData.includesDate(photo.date)) {
        currentBasket.data.push(photo);
      } else {
        sections.push(currentBasket);
        const newSectionDate = sectionDateFactory.createSectionDate(photo.date, groupType);
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
