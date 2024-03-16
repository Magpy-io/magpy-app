import { createSlice } from '@reduxjs/toolkit';

import { insertPhotoKeyWithOrder, mergePhotos } from './Helpers';

export type PhotoServerType = {
  id: string;
  fileSize: number;
  fileName: string;
  height: number;
  width: number;
  date: string;
  syncDate: string;
  mediaId: string | undefined;
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
  date: string;
  type: string;
};

// The same photo can have different dates in photosLocal and photosServer
// See https://trello.com/c/wH97h64t/44-get-date-from-exif-data-for-local-photos

export type PhotoGalleryType = {
  key: string;
  date: string;
} & (
  | { serverId: string; mediaId: undefined }
  | { serverId: undefined; mediaId: string }
  | { serverId: string; mediaId: string }
);

export type PhotosLocalType = {
  [key: string]: PhotoLocalType;
};

export type PhotosServerType = { [key: string]: PhotoServerType };

export type PhotosState = {
  photosServer: PhotosServerType;
  photosServerIdsOrdered: string[];
  photosLocal: PhotosLocalType;
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
      state.photosServer = action.payload.reduce((accumulator: PhotosServerType, photo) => {
        accumulator[photo.id] = photo;
        return accumulator;
      }, {});
      state.photosServerIdsOrdered = action.payload.map(photo => photo.id);
      state.photosGallery = mergePhotos(state);
    },

    setPhotosLocal: (state, action: { payload: PhotoLocalType[] }) => {
      state.photosLocal = action.payload.reduce((accumulator: PhotosLocalType, photo) => {
        accumulator[photo.id] = photo;
        return accumulator;
      }, {});
      state.photosLocalIdsOrdered = action.payload.map(photo => photo.id);
      state.photosGallery = mergePhotos(state);
    },

    addCompressedPhotoById: (state, action: { payload: { id: string; uri: string } }) => {
      state.photosServer[action.payload.id].uriCompressed = action.payload.uri;
    },

    addThumbnailPhotoById: (state, action: { payload: { id: string; uri: string } }) => {
      state.photosServer[action.payload.id].uriThumbnail = action.payload.uri;
    },

    addMediaIdToServerPhoto: (state, action: { payload: { id: string; mediaId: string } }) => {
      state.photosServer[action.payload.id].mediaId = action.payload.mediaId;
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

    addPhotoFromServerToLocal: (
      state,
      action: { payload: { photoLocal: PhotoLocalType; serverId: string } },
    ) => {
      state.photosLocal[action.payload.photoLocal.id] = action.payload.photoLocal;

      insertPhotoKeyWithOrder(
        state.photosLocal,
        state.photosLocalIdsOrdered,
        action.payload.photoLocal,
      );

      const galleryPhoto = state.photosGallery.find(
        p => p.serverId == action.payload.serverId,
      );

      if (galleryPhoto) {
        galleryPhoto.mediaId = action.payload.photoLocal.id;
      }
    },

    deletePhotosFromLocal: (state, action: { payload: { mediaIds: string[] } }) => {
      action.payload.mediaIds.forEach(mediaId => {
        delete state.photosLocal[mediaId];
      });

      state.photosLocalIdsOrdered = state.photosLocalIdsOrdered.filter(mediaId => {
        return !action.payload.mediaIds.includes(mediaId);
      });

      state.photosGallery = mergePhotos(state);
    },

    deletePhotosFromServer: (state, action: { payload: { serverIds: string[] } }) => {
      action.payload.serverIds.forEach(serverId => {
        delete state.photosServer[serverId];
      });

      state.photosServerIdsOrdered = state.photosServerIdsOrdered.filter(serverId => {
        return !action.payload.serverIds.includes(serverId);
      });

      state.photosGallery = mergePhotos(state);
    },

    deletePhotos: (state, action: { payload: { photos: PhotoGalleryType[] } }) => {
      const mediaIds = action.payload.photos.map(p => p.mediaId);
      const serverIds = action.payload.photos.map(p => p.serverId);

      mediaIds.forEach(mediaId => {
        delete state.photosLocal[mediaId ?? ''];
      });

      serverIds.forEach(serverId => {
        delete state.photosServer[serverId ?? ''];
      });

      state.photosLocalIdsOrdered = state.photosLocalIdsOrdered.filter(mediaId => {
        return !mediaIds.includes(mediaId);
      });

      state.photosServerIdsOrdered = state.photosServerIdsOrdered.filter(serverId => {
        return !serverIds.includes(serverId);
      });

      state.photosGallery = mergePhotos(state);
    },
  },
});

export const {
  setPhotosServer,
  setPhotosLocal,
  addCompressedPhotoById,
  addThumbnailPhotoById,
  addMediaIdToServerPhoto,
  addPhotoFromLocalToServer,
  addPhotoFromServerToLocal,
  deletePhotosFromLocal,
  deletePhotosFromServer,
  deletePhotos,
} = photosServerSlice.actions;

export default photosServerSlice.reducer;
