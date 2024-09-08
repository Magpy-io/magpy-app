import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';

import { Filter } from './Filter';

export type TypeFilterName = 'Type';
export type TypeFilterValue = 'photos' | 'videos';
export type TypeFilterParams = { value: TypeFilterValue };

export type TypeFilterObjectType = {
  type: TypeFilterName;
  params: TypeFilterParams;
};

export class TypeFilter implements Filter {
  type: TypeFilterName;
  value: TypeFilterValue;

  constructor(params: TypeFilterParams) {
    this.type = 'Type';
    this.value = params.value;
  }

  filter(photos: PhotoGalleryType[]) {
    switch (this.value) {
      case 'photos':
        return photos;
      case 'videos':
        return [];
    }
  }

  toObject() {
    return { type: this.type, params: { value: this.value } };
  }
}
