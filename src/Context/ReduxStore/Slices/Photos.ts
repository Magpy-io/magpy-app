import { createSlice } from '@reduxjs/toolkit';

export type PhotoServerType = {
  id: string;
  fileSize: number;
  fileName: string;
  height: number;
  width: number;
  created: string;
  syncDate: string;
  clientPaths: Array<{ deviceUniquedId: string; path: string }>;
  uriThumbnail: string | undefined;
  uriCompressed: string | undefined;
};

export type PhotoLocalType = {
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
  //id: string | undefined;
  uri: string;
};

export type PhotosState = {
  photosServer: { [key: string]: PhotoServerType };
  photosServerIdsOrdered: string[];
  photosLocal: { [key: string]: PhotoLocalType };
  photosLocalUriOrdered: string[];
  photosGallery: PhotoGalleryType[];
};

const initialState: PhotosState = {
  photosServer: {},
  photosServerIdsOrdered: [],
  photosLocal: {},
  photosLocalUriOrdered: [],
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
      state.photosGallery = action.payload.map(photo => {
        return {
          id: photo.id,
          uri: 'undefined',
        };
      });
    },

    setPhotosLocal: (state, action: { payload: PhotoLocalType[] }) => {
      state.photosLocal = action.payload.reduce(
        (accumulator: { [key: string]: PhotoLocalType }, photo) => {
          accumulator[photo.uri] = photo;
          return accumulator;
        },
        {},
      );
      state.photosLocalUriOrdered = action.payload.map(photo => photo.uri);
      state.photosGallery = action.payload.map(photo => {
        return {
          id: 'id',
          uri: photo.uri,
        };
      });
    },

    addCompressedPhotoById: (state, action: { payload: { id: string; uri: string } }) => {
      state.photosServer[action.payload.id].uriCompressed = action.payload.uri;
    },

    addThumbnailPhotoById: (state, action: { payload: { id: string; uri: string } }) => {
      state.photosServer[action.payload.id].uriThumbnail = action.payload.uri;
    },
  },
});

export const {
  setPhotosServer,
  setPhotosLocal,
  addCompressedPhotoById,
  addThumbnailPhotoById,
} = photosServerSlice.actions;

export default photosServerSlice.reducer;
