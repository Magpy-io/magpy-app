import { RootState } from '../Store';
import { PhotoGalleryType } from './Photos';

export function photoSelector(photo?: PhotoGalleryType) {
  return (state: RootState) => {
    if (photo?.mediaId) {
      return photoLocalSelector(photo.mediaId)(state);
    }
    if (photo?.serverId) {
      return photoServerSelector(photo.serverId)(state);
    }
    return undefined;
  };
}

export function photoLocalSelector(id?: string) {
  return (state: RootState) => (id ? state.photos.photosLocal[id] : undefined);
}

export function photoServerSelector(id?: string) {
  return (state: RootState) => (id ? state.photos.photosServer[id] : undefined);
}
