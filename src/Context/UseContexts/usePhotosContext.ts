import { useCallback } from 'react';

//import { ErrorCodes } from 'react-native-delete-media';

import { Actions } from '~/Context/ContextSlices/PhotosContext/PhotosReducer';
import { useMainContext } from '~/Context/MainContextProvider';
import {
  DeletePhotosFromDevice,
  addPhotoToCache,
  clearCache,
} from '~/Helpers/GetGalleryPhotos';
import { GetMorePhotosLocal, GetMorePhotosServer } from '~/Helpers/GetMorePhotos';
import { DeletePhotosById, GetPhotosById } from '~/Helpers/ServerQueries';
import { PhotoType } from '~/Helpers/types';

const ITEMS_TO_LOAD_PER_END_REACHED_LOCAL = 3000;
const ITEMS_TO_LOAD_PER_END_REACHED_SERVER = 3000;

export function usePhotosFunctions() {
  const { photosData } = useMainContext();
  const { photosDispatch } = photosData;

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
          if (!v.exists) {
            throw new Error(
              'RequestThumbnailPhotosServer: photosWithImage64Filtered contains images whith exits=false, wich should not be possible',
            );
          }

          return {
            id: v.photo?.id,
            image64: v.photo?.image64,
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
    RequestCompressedPhotoServer,
    RequestThumbnailPhotosServer,
    DeletePhotosLocal,
    DeletePhotosServer,
  };
}

export function usePhotosContext() {
  const { photosData } = useMainContext();

  return photosData;
}
