import {
  PhotoGalleryType,
  PhotosLocalType,
  PhotosServerType,
} from '~/Context/ReduxStore/Slices/Photos/Photos';

export type FilterObjectType = TypeFilterObjectType | StatusFilterObjectType;

export interface Filter {
  filter(
    photos: PhotoGalleryType[],
    photosServer: PhotosServerType,
    photosLocal: PhotosLocalType,
  ): void;
  toObject(): FilterObjectType;
}

export type TypeFilterObjectType = { type: 'Type'; params: { value: TypeFilterValue } };
export type StatusFilterObjectType = { type: 'Status'; params: { value: StatusFilterValue } };

export type TypeFilterValue = 'photos' | 'videos';
export type StatusFilterValue = 'inDevice' | 'inServer';

export class TypeFilter implements Filter {
  type: 'Type';
  value: TypeFilterValue;

  constructor(value: TypeFilterValue) {
    this.type = 'Type';
    this.value = value;
  }

  filter(photos: PhotoGalleryType[]) {
    return photos;
  }

  toObject() {
    return { type: this.type, params: { value: this.value } };
  }
}

export class StatusFilter implements Filter {
  type: 'Status';
  value: StatusFilterValue;

  constructor(value: StatusFilterValue) {
    this.type = 'Status';
    this.value = value;
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
