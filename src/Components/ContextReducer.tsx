import { PhotoType } from "~/Helpers/types";

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
  setNewPhotosLocal = "SET_NEW_PHOTOS_LOCAL",
  setNewPhotosServer = "SET_NEW_PHOTOS_SERVER",
  addToPhotosLocal = "ADD_TO_PHOTOS_LOCAL",
  addToPhotosServer = "ADD_TO_PHOTOS_SERVER",
  addFullPhotoById = "ADD_FULL_PHOTO_BY_ID",
  addPhotoLocal = "ADD_PHOTO_LOCAL",
  addPhotoServer = "ADD_PHOTO_SERVER",
  deletePhotoLocalFromLocal = "DELETE_PHOTO_LOCAL_FROM_LOCAL",
  deletePhotoLocalFromServer = "DELETE_PHOTO_LOCAL_FROM_SERVER",
  deletePhotoServer = "DELETE_PHOTO_SERVER",
  updatePhotoProgress = "UPDATE_PHOTO_PROGRESS",
}

type Action = {
  type: Actions;
  payload?: any;
};

function GlobalReducer(prevState: stateType, action: Action) {
  switch (action.type) {
    case Actions.setNewPhotosLocal: {
      const newState = { ...prevState };
      newState.nextOffsetLocal = action.payload.newPhotos.nextOffset;
      newState.endReachedLocal = action.payload.newPhotos.endReached;
      newState.photosLocal = action.payload.newPhotos.photos;
      return newState;
    }

    case Actions.setNewPhotosServer: {
      const newState = { ...prevState };
      newState.nextOffsetServer = action.payload.newPhotos.nextOffset;
      newState.endReachedServer = action.payload.newPhotos.endReached;
      newState.photosServer = action.payload.newPhotos.photos;
      return newState;
    }

    case Actions.addToPhotosLocal: {
      const newState = { ...prevState };
      newState.nextOffsetLocal = action.payload.newPhotos.nextOffset;
      newState.endReachedLocal = action.payload.newPhotos.endReached;
      newState.photosLocal = [
        ...prevState.photosLocal,
        ...action.payload.newPhotos.photos,
      ];
      return newState;
    }

    case Actions.addToPhotosServer: {
      const newState = { ...prevState };
      newState.nextOffsetServer = action.payload.newPhotos.nextOffset;
      newState.endReachedServer = action.payload.newPhotos.endReached;
      newState.photosServer = [
        ...prevState.photosServer,
        ...action.payload.newPhotos.photos,
      ];
      return newState;
    }

    case Actions.addFullPhotoById: {
      const newState = { ...prevState };
      const newPhotosServer = [...newState.photosServer];
      const findCorrespondingPhoto = newPhotosServer.find(
        (photo) => photo.id == action.payload.result.data.photo.id
      );
      if (findCorrespondingPhoto) {
        findCorrespondingPhoto.image.image64Full = `data:image/jpeg;base64,${action.payload.result.data.photo.image64}`;
      }
      newState.photosServer = newPhotosServer;
      return newState;
    }

    case Actions.addPhotoLocal: {
      const newState = { ...prevState };
      const newPhotosServer = [...newState.photosServer];
      const findCorrespondingPhoto = newPhotosServer.find(
        (photo) => photo.id == action.payload.photo.id
      );
      if (findCorrespondingPhoto) {
        findCorrespondingPhoto.inDevice = true;
      }
      newState.photosServer = newPhotosServer;
      return newState;
    }

    case Actions.addPhotoServer: {
      const newState = { ...prevState };
      const newPhotosLocal = [...newState.photosLocal];
      const findCorrespondingPhotoIndex = newPhotosLocal.findIndex(
        (photo) => photo.id == action.payload.photo.id
      );
      if (findCorrespondingPhotoIndex >= 0) {
        newPhotosLocal.splice(findCorrespondingPhotoIndex, 1);
      }
      newState.photosLocal = newPhotosLocal;
      return newState;
    }

    case Actions.deletePhotoLocalFromLocal: {
      const newState = { ...prevState };
      const newPhotosLocal = [...newState.photosLocal];
      const findCorrespondingPhotoIndex = newPhotosLocal.findIndex(
        (photo) => photo.id == action.payload.photo.id
      );
      if (findCorrespondingPhotoIndex >= 0) {
        newPhotosLocal.splice(findCorrespondingPhotoIndex, 1);
      }
      newState.photosLocal = newPhotosLocal;
      return newState;
    }

    case Actions.deletePhotoLocalFromServer: {
      const newState = { ...prevState };
      const newPhotosServer = [...newState.photosServer];
      const findCorrespondingPhoto = newPhotosServer.find(
        (photo) => photo.id == action.payload.photo.id
      );
      if (findCorrespondingPhoto) {
        findCorrespondingPhoto.inDevice = false;
      }
      newState.photosServer = newPhotosServer;
      return newState;
    }

    case Actions.deletePhotoServer: {
      const newState = { ...prevState };
      const newPhotosServer = [...newState.photosServer];
      const findCorrespondingPhotoIndex = newPhotosServer.findIndex(
        (photo) => photo.id == action.payload.photo.id
      );
      if (findCorrespondingPhotoIndex >= 0) {
        newPhotosServer.splice(findCorrespondingPhotoIndex, 1);
      }
      newState.photosServer = newPhotosServer;
      return newState;
    }
    case Actions.updatePhotoProgress: {
      const newState = { ...prevState };
      const newPhotosLocal = [...newState.photosLocal];
      const findCorrespondingPhoto = newPhotosLocal.find(
        (photo) => photo.id == action.payload.photo.id
      );
      if (findCorrespondingPhoto) {
        findCorrespondingPhoto.isLoading = true;
        findCorrespondingPhoto.loadingPercentage = action.payload.p;
      }
      newState.photosServer = newPhotosLocal;
      return newState;
    }
  }
  return prevState;
}

export { GlobalReducer, initialState, Actions };
