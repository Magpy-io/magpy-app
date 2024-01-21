import { PhotoType } from '~/Helpers/types';

type stateType = {
  photosLocal: Array<PhotoType>;
  nextOffsetLocal: number;
  endReachedLocal: boolean;
  photosServer: Array<PhotoType>;
  nextOffsetServer: number;
  endReachedServer: boolean;
};

const initialState = {
  photosLocal: new Array<PhotoType>(),
  nextOffsetLocal: 0,
  endReachedLocal: false,
  photosServer: new Array<PhotoType>(),
  nextOffsetServer: 0,
  endReachedServer: false,
};

enum Actions {
  setNewPhotosLocal = 'SET_NEW_PHOTOS_LOCAL',
  setNewPhotosServer = 'SET_NEW_PHOTOS_SERVER',
  addToPhotosLocal = 'ADD_TO_PHOTOS_LOCAL',
  addToPhotosServer = 'ADD_TO_PHOTOS_SERVER',
  addFullPhotoById = 'ADD_FULL_PHOTO_BY_ID',
  addPhotoLocal = 'ADD_PHOTO_LOCAL',
  addPhotoServer = 'ADD_PHOTO_SERVER',
  deletePhotosLocalFromLocal = 'DELETE_PHOTOS_LOCAL_FROM_LOCAL',
  deletePhotosLocalFromServer = 'DELETE_PHOTOS_LOCAL_FROM_SERVER',
  deletePhotosServer = 'DELETE_PHOTOS_SERVER',
  updatePhotoProgress = 'UPDATE_PHOTO_PROGRESS',
  updatePhotoProgressServer = 'UPDATE_PHOTO_PROGRESS_SERVER',
  addCroppedPhotos = 'ADD_CROPPED_PHOTOS',
  updatePhotosFromService = 'UPDATE_PHOTOS_FROM_SERVICE',
  clearAllLoadingLocal = 'CLEAR_ALL_LOADING_LOCAL',
}

type Action = {
  type: Actions;
  payload?: unknown;
};

function GlobalReducer(prevState: stateType, action: Action) {
  switch (action.type) {
    case Actions.setNewPhotosLocal: {
      const payload = action.payload as {
        newPhotos: { photos: PhotoType[]; endReached: boolean; nextOffset: number };
      };
      const newState = { ...prevState };
      newState.nextOffsetLocal = payload.newPhotos.nextOffset;
      newState.endReachedLocal = payload.newPhotos.endReached;
      newState.photosLocal = payload.newPhotos.photos;

      return newState;
    }

    case Actions.setNewPhotosServer: {
      const newState = { ...prevState };
      const payload = action.payload as {
        newPhotos: { photos: PhotoType[]; endReached: boolean; nextOffset: number };
      };
      newState.nextOffsetServer = payload.newPhotos.nextOffset;
      newState.endReachedServer = payload.newPhotos.endReached;
      newState.photosServer = payload.newPhotos.photos;
      return newState;
    }

    case Actions.addToPhotosLocal: {
      const newState = { ...prevState };
      newState.nextOffsetLocal = action.payload.newPhotos.nextOffset;
      newState.endReachedLocal = action.payload.newPhotos.endReached;
      newState.photosLocal = [...prevState.photosLocal, ...action.payload.newPhotos.photos];
      return newState;
    }

    case Actions.addToPhotosServer: {
      const newState = { ...prevState };
      newState.nextOffsetServer = action.payload.newPhotos.nextOffset;
      newState.endReachedServer = action.payload.newPhotos.endReached;
      newState.photosServer = [...prevState.photosServer, ...action.payload.newPhotos.photos];
      return newState;
    }

    case Actions.addFullPhotoById: {
      const newState = { ...prevState };
      const newPhotosServer = [...newState.photosServer];
      const findCorrespondingPhotoIndex = newPhotosServer.findIndex(
        photo => photo.id == action.payload.photo.id,
      );
      if (findCorrespondingPhotoIndex >= 0) {
        const newPhoto = { ...newPhotosServer[findCorrespondingPhotoIndex] };
        newPhoto.image.pathCache = action.payload.photo.image.pathCache;
        newPhotosServer[findCorrespondingPhotoIndex] = newPhoto;
        newState.photosServer = newPhotosServer;
        return newState;
      } else {
        return prevState;
      }
    }

    case Actions.addPhotoLocal: {
      const newState = { ...prevState };
      const newPhotosServer = [...newState.photosServer];
      const findCorrespondingPhoto = newPhotosServer.find(
        photo => photo.id == action.payload.photo.id,
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
      const newState = { ...prevState };
      const newPhotosLocal = [...newState.photosLocal];
      const findCorrespondingPhotoIndex = newPhotosLocal.findIndex(
        photo => photo.id == action.payload.photo.id,
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
      const newState = { ...prevState };

      const ids: string[] = action.payload.photos.map((photo: PhotoType) => photo.id);

      newState.photosLocal = newState.photosLocal.filter(photo => !ids.includes(photo.id));

      return newState;
    }

    case Actions.deletePhotosLocalFromServer: {
      const newState = { ...prevState };

      const newPhotosServer = [...newState.photosServer];

      const ids: string[] = action.payload.photos.map((photo: PhotoType) => photo.id);

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
      const newState = { ...prevState };

      newState.photosServer = newState.photosServer.filter(
        photo => !action.payload.ids.includes(photo.id),
      );

      return newState;
    }

    case Actions.updatePhotoProgress: {
      const newState = { ...prevState };
      const newPhotosLocal = [...newState.photosLocal];
      const findCorrespondingPhotoIndex = newPhotosLocal.findIndex(
        photo => photo.id == action.payload.photo.id,
      );
      if (findCorrespondingPhotoIndex >= 0) {
        const newPhoto = { ...newPhotosLocal[findCorrespondingPhotoIndex] };
        newPhoto.isLoading = action.payload.isLoading;
        newPhoto.loadingPercentage = action.payload.p;
        newPhotosLocal[findCorrespondingPhotoIndex] = newPhoto;
        newState.photosLocal = newPhotosLocal;
        return newState;
      } else {
        return prevState;
      }
    }

    case Actions.addCroppedPhotos: {
      const newState = { ...prevState };

      const newPhotosServer = [...newState.photosServer];
      action.payload.images64.forEach((requestPhoto: any) => {
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

    case Actions.updatePhotoProgressServer: {
      const newState = { ...prevState };
      const newPhotosServer = [...newState.photosServer];
      const findCorrespondingPhotoIndex = newPhotosServer.findIndex(
        photo => photo.id == action.payload.photo.id,
      );
      if (findCorrespondingPhotoIndex >= 0) {
        const newPhoto = { ...newPhotosServer[findCorrespondingPhotoIndex] };
        newPhoto.isLoading = action.payload.isLoading;
        newPhoto.loadingPercentage = action.payload.p;
        newPhotosServer[findCorrespondingPhotoIndex] = newPhoto;
        newState.photosServer = newPhotosServer;
        return newState;
      } else {
        return prevState;
      }
    }

    case Actions.updatePhotosFromService: {
      const newState = { ...prevState };
      const newPhotosLocal = [...newState.photosLocal];
      const ids = action.payload.ids;
      const currentIndex = action.payload.currentIndex;
      const idsSliced = ids.slice(0, currentIndex);

      const newPhotosLocalFiltered = newPhotosLocal.filter(photo => {
        return !idsSliced.includes(photo.id);
      });

      for (let i = currentIndex; i < ids.length; i++) {
        const index = newPhotosLocalFiltered.findIndex(photo => photo.id == ids[i]);

        if (index >= 0) {
          if (!newPhotosLocalFiltered[index].isLoading) {
            const newPhoto = { ...newPhotosLocalFiltered[index] };
            newPhoto.isLoading = true;
            newPhoto.loadingPercentage = 0;
            newPhotosLocalFiltered[index] = newPhoto;
          }
        }
      }

      newState.photosLocal = newPhotosLocalFiltered;
      return newState;
    }

    case Actions.clearAllLoadingLocal: {
      const newState = { ...prevState };

      let anyPhotoLoading = false;
      const newPhotosLocal = [...newState.photosLocal];
      for (let i = 0; i < newPhotosLocal.length; i++) {
        if (newPhotosLocal[i].isLoading) {
          anyPhotoLoading = true;
          const newPhoto = { ...newPhotosLocal[i] };
          newPhoto.isLoading = false;
          newPhoto.loadingPercentage = 0;
          newPhotosLocal[i] = newPhoto;
        }
      }
      if (anyPhotoLoading) {
        newState.photosLocal = newPhotosLocal;
        return newState;
      }

      return prevState;
    }
  }
  return prevState;
}

export { GlobalReducer, initialState, Actions };
export type { Action };