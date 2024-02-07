import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../Store';

export function photoLocalSelector(id?: string) {
  return (state: RootState) => (id ? state.photos.photosLocal[id] : undefined);
}

export function photoServerSelector(id?: string) {
  return (state: RootState) => (id ? state.photos.photosServer[id] : undefined);
}

export const selectGalleryPhotos = (state: RootState) => state.photos.photosGallery;

export const serverGalleryPhotosSelector = createSelector(
  [selectGalleryPhotos],
  photosGallery => {
    return photosGallery.filter(p => p.serverId);
  },
);

export const localGalleryPhotosSelector = createSelector(
  [selectGalleryPhotos],
  photosGallery => {
    return photosGallery.filter(p => !p.serverId);
  },
);
