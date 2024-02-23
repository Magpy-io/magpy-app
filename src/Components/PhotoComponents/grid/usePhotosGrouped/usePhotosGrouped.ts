import { useCallback, useMemo } from 'react';

import { SectionType } from '~/Components/CommonComponents/SectionListWithColumns/Types';
import { GroupType } from '~/Context/ReduxStore/Slices/GalleryOptions/GalleryOptions';
import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';

import { getIndexInSectionList, getSectionsFromPhotos } from './Helpers';
import { SectionDate } from './SectionDate';

export type SectionDataType = SectionDate;
export type SectionTypePhotoGrid = SectionType<PhotoGalleryType, SectionDataType>;

export function usePhotosGrouped(photos: Array<PhotoGalleryType>, groupBy: GroupType) {
  const sections: SectionTypePhotoGrid[] = useMemo(() => {
    return getSectionsFromPhotos(photos, groupBy);
  }, [photos, groupBy]);

  const indexToSectionLocation = useCallback(
    (currentPhoto: PhotoGalleryType) => {
      if (sections && sections.length > 0) {
        return getIndexInSectionList(currentPhoto, sections);
      }
      return { sectionIndex: 0, itemIndex: 0 };
    },
    [sections],
  );

  return { sections, indexToSectionLocation };
}
