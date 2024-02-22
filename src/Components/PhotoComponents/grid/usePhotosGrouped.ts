import { useCallback, useMemo } from 'react';

import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';
import { clamp } from '~/Helpers/Utilities';

import { SectionTypePhotoGrid, getIndexInSectionList, getPhotosPerDay } from './Helpers';

export function usePhotosGrouped(photos: Array<PhotoGalleryType>) {
  const sections: SectionTypePhotoGrid[] = useMemo(() => {
    return getPhotosPerDay(photos);
  }, [photos]);

  const indexToSectionLocation = useCallback(
    (index: number) => {
      if (sections && sections.length > 0) {
        const currentPhotoIndexClamped = clamp(index, photos.length - 1);
        const currentPhoto = photos[currentPhotoIndexClamped];
        return getIndexInSectionList(currentPhoto, sections);
      }
      return { sectionIndex: 0, itemIndex: 0 };
    },
    [photos, sections],
  );

  return { sections, indexToSectionLocation };
}
