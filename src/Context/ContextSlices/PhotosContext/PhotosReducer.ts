import { PhotoType } from '~/Helpers/types';

export type PhotosStateType = {
  photosLocal: Array<PhotoType>;
  photosServer: Array<PhotoType>;
};

const initialState = {
  photosLocal: new Array<PhotoType>(),
  photosServer: new Array<PhotoType>(),
};

enum Actions {
  setNewPhotosLocal = 'SET_NEW_PHOTOS_LOCAL',
  setNewPhotosServer = 'SET_NEW_PHOTOS_SERVER',
  addFullPhotoById = 'ADD_FULL_PHOTO_BY_ID',
  addPhotoLocal = 'ADD_PHOTO_LOCAL',
  addPhotoServer = 'ADD_PHOTO_SERVER',
  deletePhotosLocalFromLocal = 'DELETE_PHOTOS_LOCAL_FROM_LOCAL',
  deletePhotosLocalFromServer = 'DELETE_PHOTOS_LOCAL_FROM_SERVER',
  deletePhotosServer = 'DELETE_PHOTOS_SERVER',
  addCroppedPhotos = 'ADD_CROPPED_PHOTOS',
}

type Action = {
  type: Actions;
  payload?: unknown;
};

function GlobalReducer(prevState: PhotosStateType, action: Action) {
  switch (action.type) {
    case Actions.setNewPhotosLocal: {
      const payload = action.payload as {
        newPhotos: { photos: PhotoType[] };
      };
      const newState = { ...prevState };
      newState.photosLocal = payload.newPhotos.photos;

      return newState;
    }

    case Actions.setNewPhotosServer: {
      const payload = action.payload as {
        newPhotos: { photos: PhotoType[] };
      };
      const newState = { ...prevState };
      newState.photosServer = payload.newPhotos.photos;
      return newState;
    }

    case Actions.addFullPhotoById: {
      const payload = action.payload as {
        photo: PhotoType;
      };
      const newState = { ...prevState };
      const newPhotosServer = [...newState.photosServer];
      const findCorrespondingPhotoIndex = newPhotosServer.findIndex(
        photo => photo.id == payload.photo.id,
      );
      if (findCorrespondingPhotoIndex >= 0) {
        const newPhoto = { ...newPhotosServer[findCorrespondingPhotoIndex] };
        newPhoto.image.pathCache = payload.photo.image.pathCache;
        newPhotosServer[findCorrespondingPhotoIndex] = newPhoto;
        newState.photosServer = newPhotosServer;
        return newState;
      } else {
        return prevState;
      }
    }

    case Actions.addPhotoLocal: {
      const payload = action.payload as {
        photo: PhotoType;
      };
      const newState = { ...prevState };
      const newPhotosServer = [...newState.photosServer];
      const findCorrespondingPhoto = newPhotosServer.find(
        photo => photo.id == payload.photo.id,
      );
      if (findCorrespondingPhoto) {
        findCorrespondingPhoto.inDevice = true;
        newState.photosServer = newPhotosServer;
        return newState;
      } else {
        return prevState;
      }
    }

    case Actions.addPhotoServer: {
      const payload = action.payload as {
        photo: PhotoType;
      };
      const newState = { ...prevState };
      const newPhotosLocal = [...newState.photosLocal];
      const findCorrespondingPhotoIndex = newPhotosLocal.findIndex(
        photo => photo.id == payload.photo.id,
      );
      if (findCorrespondingPhotoIndex >= 0) {
        newPhotosLocal.splice(findCorrespondingPhotoIndex, 1);
        newState.photosLocal = newPhotosLocal;
        return newState;
      } else {
        return prevState;
      }
    }

    case Actions.deletePhotosLocalFromLocal: {
      const payload = action.payload as {
        photos: PhotoType[];
      };
      const newState = { ...prevState };
      const ids: string[] = payload.photos.map((photo: PhotoType) => photo.id);

      newState.photosLocal = newState.photosLocal.filter(photo => !ids.includes(photo.id));

      return newState;
    }

    case Actions.deletePhotosLocalFromServer: {
      const payload = action.payload as {
        photos: PhotoType[];
      };
      const newState = { ...prevState };
      const newPhotosServer = [...newState.photosServer];

      const ids: string[] = payload.photos.map((photo: PhotoType) => photo.id);

      ids.forEach(id => {
        const photo = newPhotosServer.find(v => v.id == id);
        if (photo) {
          photo.inDevice = false;
        }
      });

      newState.photosServer = newPhotosServer;
      return newState;
    }

    case Actions.deletePhotosServer: {
      const payload = action.payload as {
        ids: string[];
      };
      const newState = { ...prevState };
      newState.photosServer = newState.photosServer.filter(
        photo => !payload.ids.includes(photo.id),
      );

      return newState;
    }

    case Actions.addCroppedPhotos: {
      const payload = action.payload as {
        images64: { id: string; image64: string }[];
      };
      const newState = { ...prevState };
      const newPhotosServer = [...newState.photosServer];
      payload.images64.forEach(requestPhoto => {
        const index = newPhotosServer.findIndex(v => v.id == requestPhoto.id);

        if (index >= 0) {
          const newPhoto = { ...newPhotosServer[index] };
          newPhoto.image.image64 = `data:image/jpeg;base64,${requestPhoto.image64}`;
          newPhotosServer[index] = newPhoto;
        }
      });

      newState.photosServer = newPhotosServer;
      return newState;
    }
  }
  return prevState;
}

export { GlobalReducer, initialState, Actions };
export type { Action };
