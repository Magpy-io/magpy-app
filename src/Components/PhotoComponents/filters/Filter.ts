import {
  PhotoGalleryType,
  PhotosLocalType,
  PhotosServerType,
} from '~/Context/ReduxStore/Slices/Photos/Photos';

import { DateFilterName, DateFilterObjectType } from './DateFilter';
import { StatusFilterName, StatusFilterObjectType } from './StatusFilter';
import { TypeFilterName, TypeFilterObjectType } from './TypeFilter';

export type FilterObjectType =
  | TypeFilterObjectType
  | StatusFilterObjectType
  | DateFilterObjectType;

export type FilterNameType = TypeFilterName | DateFilterName | StatusFilterName;

export interface Filter {
  filter(
    photos: PhotoGalleryType[],
    photosServer: PhotosServerType,
    photosLocal: PhotosLocalType,
  ): void;
  toObject(): FilterObjectType;
}
