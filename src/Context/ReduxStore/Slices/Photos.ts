import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../Store';

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

function mergePhotos(photosState: PhotosState): PhotoGalleryType[] {
  let localIndex = 0;
  let serverIndex = 0;

  const { photosLocal, photosLocalIdsOrdered, photosServer, photosServerIdsOrdered } =
    photosState;

  const galleryPhotos: PhotoGalleryType[] = [];

  while (
    localIndex < photosLocalIdsOrdered.length ||
    serverIndex < photosServerIdsOrdered.length
  ) {
    const photoLocal = photosLocal[photosLocalIdsOrdered[localIndex]];
    const photoServer = photosServer[photosServerIdsOrdered[serverIndex]];

    const diff = compareDates(photoLocal?.created, photoServer?.created);

    if (
      diff == 0 &&
      photoLocal.fileSize == photoServer.fileSize &&
      photoLocal.uri == photoServer.uri
    ) {
      galleryPhotos.push({
        key: photoServer.id,
        serverId: photoServer.id,
        mediaId: photoLocal.id,
      });
      localIndex += 1;
      serverIndex += 1;
      continue;
    }

    if (diff >= 0) {
      galleryPhotos.push({
        key: photoLocal.id,
        serverId: undefined,
        mediaId: photoLocal.id,
      });
      localIndex += 1;
    } else {
      galleryPhotos.push({
        key: photoServer.id,
        serverId: photoServer.id,
        mediaId: undefined,
      });
      serverIndex += 1;
    }
  }

  return galleryPhotos;
}

// function insertPhotoKeyWithOrder<T extends { created: string }>(photos: T[], photo: T) {
//   const insertIndex = photos.findIndex(p => compareDates(p.created, photo.created) <= 0);
// }

export function compareDates(date1: string, date2: string) {
  if (!date2) {
    return 1;
  }

  if (!date1) {
    return -1;
  }

  const d1 = Date.parse(date1);
  const d2 = Date.parse(date2);

  if (d1 > d2) {
    return 1;
  } else if (d1 < d2) {
    return -1;
  } else {
    return 0;
  }
}
