import { createSlice } from '@reduxjs/toolkit';

import { insertPhotoKeyWithOrder, mergePhotos } from './Helpers';

export type PhotoServerType = {
  id: string;
  fileSize: number;
  fileName: string;
  height: number;
  width: number;
  created: string;
  syncDate: string;
  uri: string | undefined;
  uriThumbnail: string | undefined;
  uriCompressed: string | undefined;
};

export type PhotoLocalType = {
  id: string;
  uri: string;
  fileSize: number;
  fileName: string;
  height: number;
  width: number;
  group_name: string[];
  created: string;
  modified: string;
  type: string;
};

export type PhotoGalleryType = {
  key: string;
} & (
  | { serverId: string; mediaId: undefined }
  | { serverId: undefined; mediaId: string }
  | { serverId: string; mediaId: string }
);

export type PhotosState = {
  photosServer: { [key: string]: PhotoServerType };
  photosServerIdsOrdered: string[];
  photosLocal: { [key: string]: PhotoLocalType };
  photosLocalIdsOrdered: string[];
  photosGallery: PhotoGalleryType[]; // First elemnt is the most recent photo
};

const initialState: PhotosState = {
  photosServer: {},
  photosServerIdsOrdered: [],
  photosLocal: {},
  photosLocalIdsOrdered: [],
  photosGallery: [],
};

const photosServerSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    setPhotosServer: (state, action: { payload: PhotoServerType[] }) => {
      state.photosServer = action.payload.reduce(
        (accumulator: { [key: string]: PhotoServerType }, photo) => {
          accumulator[photo.id] = photo;
          return accumulator;
        },
        {},
      );
      state.photosServerIdsOrdered = action.payload.map(photo => photo.id);
      state.photosGallery = mergePhotos(state);
    },

    setPhotosLocal: (state, action: { payload: PhotoLocalType[] }) => {
      state.photosLocal = action.payload.reduce(
        (accumulator: { [key: string]: PhotoLocalType }, photo) => {
          accumulator[photo.id] = photo;
          return accumulator;
        },
        {},
      );
      state.photosLocalIdsOrdered = action.payload.map(photo => photo.id);
      state.photosGallery = mergePhotos(state);
    },

    addCompressedPhotoById: (state, action: { payload: { id: string; uri: string } }) => {
      state.photosServer[action.payload.id].uriCompressed = action.payload.uri;
    },

    addThumbnailPhotoById: (state, action: { payload: { id: string; uri: string } }) => {
      state.photosServer[action.payload.id].uriThumbnail = action.payload.uri;
    },

    addPhotoFromLocalToServer: (
      state,
      action: { payload: { photoServer: PhotoServerType; mediaId: string } },
    ) => {
      state.photosServer[action.payload.photoServer.id] = action.payload.photoServer;

      insertPhotoKeyWithOrder(
        state.photosServer,
        state.photosServerIdsOrdered,
        action.payload.photoServer,
      );

      const galleryPhoto = state.photosGallery.find(p => p.mediaId == action.payload.mediaId);
      if (galleryPhoto) {
        galleryPhoto.serverId = action.payload.photoServer.id;
      }
    },
  },
});

export const {
  setPhotosServer,
  setPhotosLocal,
  addCompressedPhotoById,
  addThumbnailPhotoById,
  addPhotoFromLocalToServer,
} = photosServerSlice.actions;

export default photosServerSlice.reducer;
