import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';

import { FilterObjectType } from './Filters/Filter';
import { FilterFactory } from './Filters/FilterFactory';

export function filterPhotos(photos: PhotoGalleryType[], filters: FilterObjectType[]) {
  const Factory = new FilterFactory();
  let newPhotos = [...photos];
  filters.forEach(f => {
    const filter = Factory.createFilter(f);
    newPhotos = filter.filter(newPhotos);
  });
  return newPhotos;
}
