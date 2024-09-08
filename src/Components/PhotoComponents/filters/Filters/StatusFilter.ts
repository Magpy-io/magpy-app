import { PhotoGalleryType } from '~/Context/ReduxStore/Slices/Photos/Photos';

import { Filter } from './Filter';

export type StatusFilterName = 'Status';
export type StatusFilterValue = 'inDevice' | 'inServer';
export type StatusFilterParams = { value: StatusFilterValue };

export type StatusFilterObjectType = {
  type: StatusFilterName;
  params: StatusFilterParams;
};

export class StatusFilter implements Filter {
  type: StatusFilterName;
  value: StatusFilterValue;

  constructor(params: StatusFilterParams) {
    this.type = 'Status';
    this.value = params.value;
  }

  filter(photos: PhotoGalleryType[]) {
    switch (this.value) {
      case 'inDevice':
        return photos.filter(photo => photo.mediaId);
      case 'inServer':
        return photos.filter(photo => photo.serverId);
    }
  }

  toObject() {
    return { type: this.type, params: { value: this.value } };
  }
}
