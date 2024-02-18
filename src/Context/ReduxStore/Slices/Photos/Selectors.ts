import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../../Store';

export function photoLocalSelector(id?: string) {
  return (state: RootState) => (id ? state.photos.photosLocal[id] : undefined);
}

export function photoServerSelector(id?: string) {
  return (state: RootState) => (id ? state.photos.photosServer[id] : undefined);
}

export const photosGallerySelector = (state: RootState) => state.photos.photosGallery;
export const photosServerSelector = (state: RootState) => state.photos.photosServer;
export const photosLocalSelector = (state: RootState) => state.photos.photosLocal;

export const serverGalleryPhotosSelector = createSelector(
  [photosGallerySelector],
  photosGallery => {
    return photosGallery.filter(p => p.serverId);
  },
);

export const localGalleryPhotosSelector = createSelector(
  [photosGallerySelector],
  photosGallery => {
    return photosGallery.filter(p => !p.serverId);
  },
);

export const recentServerGalleryPhotos = createSelector(
  [photosGallerySelector],
  photosGallery => {
    return photosGallery.filter(p => p.serverId).slice(0, 10);
  },
);
