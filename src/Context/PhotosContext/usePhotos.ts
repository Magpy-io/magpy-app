import { useCallback, useReducer } from 'react';

import { ErrorCodes } from 'react-native-delete-media';

import {
  DeletePhotosFromDevice,
  addPhotoToCache,
  clearCache,
} from '~/Helpers/GetGalleryPhotos';
import { GetMorePhotosLocal, GetMorePhotosServer } from '~/Helpers/GetMorePhotos';
import { DeletePhotosById, GetPhotosById } from '~/Helpers/ServerQueries';
import { PhotoType } from '~/Helpers/types';

import { useMainContext } from '../MainContextProvider';
import {
  Action,
  Actions,
  GlobalReducer,
  PhotosStateType,
  initialState,
} from './PhotosReducer';

const ITEMS_TO_LOAD_PER_END_REACHED_LOCAL = 3000;
const ITEMS_TO_LOAD_PER_END_REACHED_SERVER = 3000;

export type PhotosDataType = {
  photosState: PhotosStateType;
  photosDispatch: React.Dispatch<Action>;
};

export function usePhotosData(): PhotosDataType {
  const [photosState, photosDispatch] = useReducer(GlobalReducer, initialState);

  return { photosState, photosDispatch };
}

export function usePhotosFunctions() {
  const { photosData } = useMainContext();
  const { photosDispatch, photosState } = photosData;

  const RefreshPhotosLocal = useCallback(async () => {
    try {
      const newPhotos = await GetMorePhotosLocal(ITEMS_TO_LOAD_PER_END_REACHED_LOCAL, 0);
      photosDispatch({
        type: Actions.setNewPhotosLocal,
        payload: { newPhotos: newPhotos },
      });
    } catch (err) {
      console.log(err);
    }
  }, [photosDispatch]);

  const RefreshPhotosServer = useCallback(async () => {
    try {
      await clearCache();
      const newPhotos = await GetMorePhotosServer(ITEMS_TO_LOAD_PER_END_REACHED_SERVER, 0);

      photosDispatch({
        type: Actions.setNewPhotosServer,
        payload: { newPhotos: newPhotos },
      });
    } catch (err) {
      console.log(err);
    }
  }, [photosDispatch]);

  const FetchMoreLocal = useCallback(async () => {
    try {
      if (photosState.endReachedLocal) {
        return;
      }

      const newPhotos = await GetMorePhotosLocal(
        ITEMS_TO_LOAD_PER_END_REACHED_LOCAL,
        photosState.nextOffsetLocal,
      );

      photosDispatch({
        type: Actions.addToPhotosLocal,
        payload: { newPhotos: newPhotos },
      });
    } catch (err) {
      console.log(err);
    }
  }, [photosState.endReachedLocal, photosState.nextOffsetLocal, photosDispatch]);

  const FetchMoreServer = useCallback(async () => {
    try {
      if (photosState.endReachedServer) {
        return;
      }

      const newPhotos = await GetMorePhotosServer(
        ITEMS_TO_LOAD_PER_END_REACHED_SERVER,
        photosState.nextOffsetServer,
      );

      photosDispatch({
        type: Actions.addToPhotosServer,
        payload: { newPhotos: newPhotos },
      });
    } catch (err) {
      console.log(err);
    }
  }, [photosState.endReachedServer, photosState.nextOffsetServer, photosDispatch]);

  const RequestCompressedPhotoServer = useCallback(
    async (photo: PhotoType) => {
      if (photo.image.pathCache) {
        return;
      }
      try {
        const result = await GetPhotosById.Post({
          ids: [photo.id],
          photoType: 'compressed',
        });

        if (!result.ok) {
          console.log(result.errorCode);
          return;
        }

        if (!result.data.photos[0].exists) {
          console.log(`Photo with id ${photo.id} not found`);
          console.log(result);
          return;
        }

        const pathCache = await addPhotoToCache(
          photo.image.fileName,
          result.data.photos[0].photo.image64,
        );
        photo.image.pathCache = pathCache;
        photosDispatch({
          type: Actions.addFullPhotoById,
          payload: { photo: photo },
        });
      } catch (err) {
        console.log(err);
      }
    },
    [photosDispatch],
  );

  const RequestThumbnailPhotosServer = useCallback(
    async (photos: PhotoType[]) => {
      try {
        const ids = photos.map(photo => photo.id);
        const result = await GetPhotosById.Post({ ids: ids, photoType: 'thumbnail' });

        if (!result.ok) {
          console.log(result.errorCode);
          return;
        }

        const photosWithImage64 = result.data.photos;
        const photosWithImage64Filtered = photosWithImage64.filter(image64 => image64.exists);

        const images64 = photosWithImage64Filtered.map(v => {
          const vWithTypeAssertion = v as typeof v & { exists: true };
          return {
            id: vWithTypeAssertion.photo?.id,
            image64: vWithTypeAssertion.photo?.image64,
          };
        });

        photosDispatch({
          type: Actions.addCroppedPhotos,
          payload: { images64: images64 },
        });
      } catch (err) {
        console.log(err);
      }
    },
    [photosDispatch],
  );

  const DeletePhotosLocal = useCallback(
    async (photos: PhotoType[]) => {
      try {
        const uris = photos.map(photo => photo.image.path);
        let photosRemoved = true;

        try {
          await DeletePhotosFromDevice(uris);
        } catch (err) {
          photosRemoved = false;
          const code: ErrorCodes = (err as { code: ErrorCodes }).code;

          if (code != 'ERROR_USER_REJECTED') {
            throw err;
          }
        }

        if (photosRemoved) {
          photosDispatch({
            type: Actions.deletePhotosLocalFromLocal,
            payload: { photos: photos },
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    [photosDispatch],
  );

  const DeletePhotosServer = useCallback(
    async (photos: PhotoType[]) => {
      try {
        const ids = photos.map(photo => photo.id);

        photosDispatch({
          type: Actions.deletePhotosServer,
          payload: { ids: ids },
        });

        const result = await DeletePhotosById.Post({ ids: ids });

        if (!result.ok) {
          console.log(result.errorCode);
          return;
        }
      } catch (err) {
        console.log(err);
      }
    },
    [photosDispatch],
  );

  return {
    RefreshPhotosLocal,
    RefreshPhotosServer,
    FetchMoreLocal,
    FetchMoreServer,
    RequestCompressedPhotoServer,
    RequestThumbnailPhotosServer,
    DeletePhotosLocal,
    DeletePhotosServer,
  };
}