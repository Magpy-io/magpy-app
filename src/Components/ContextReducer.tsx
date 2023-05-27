import { PhotoType } from "~/Helpers/types";

type stateType = {
  photosLocal: Array<PhotoType>;
  photosLocalIdMap: Map<string, number>;
  nextOffsetLocal: number;
  endReachedLocal: boolean;
  photosServer: Array<PhotoType>;
  photosServerIdMap: Map<string, number>;
  nextOffsetServer: number;
  endReachedServer: boolean;
  isServiceAddingServerPhotos: boolean;
};

const initialState = {
  photosLocal: new Array<PhotoType>(),
  photosLocalIdMap: new Map(),
  nextOffsetLocal: 0,
  endReachedLocal: false,
  photosServer: new Array<PhotoType>(),
  photosServerIdMap: new Map(),
  nextOffsetServer: 0,
  endReachedServer: false,
  isServiceAddingServerPhotos: false,
};

enum Actions {
  setNewPhotosLocal = "SET_NEW_PHOTOS_LOCAL",
  setNewPhotosServer = "SET_NEW_PHOTOS_SERVER",
  addToPhotosLocal = "ADD_TO_PHOTOS_LOCAL",
  addToPhotosServer = "ADD_TO_PHOTOS_SERVER",
  addFullPhotoById = "ADD_FULL_PHOTO_BY_ID",
  addPhotoLocal = "ADD_PHOTO_LOCAL",
  addPhotoServer = "ADD_PHOTO_SERVER",
  deletePhotosLocalFromLocal = "DELETE_PHOTOS_LOCAL_FROM_LOCAL",
  deletePhotosLocalFromServer = "DELETE_PHOTOS_LOCAL_FROM_SERVER",
  deletePhotosServer = "DELETE_PHOTOS_SERVER",
  updatePhotoProgress = "UPDATE_PHOTO_PROGRESS",
  updatePhotoProgressServer = "UPDATE_PHOTO_PROGRESS_SERVER",
  addCroppedPhotos = "ADD_CROPPED_PHOTOS",
  setServiceAddingServerPhotos = "SET_SERVICE_ADDING_SERVER_PHOTOS",
  updatePhotosFromService = "UPDATE_PHOTOS_FROM_SERVICE",
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
      newState.photosLocalIdMap = new Map();

      newState.photosLocal.forEach((photo, index) => {
        if (index == 0) {
          console.log(photo.id);
        }
        newState.photosLocalIdMap.set(photo.id, index);
      });

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
      const findCorrespondingPhotoIndex = newPhotosServer.findIndex(
        (photo) => photo.id == action.payload.photo.id
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
        (photo) => photo.id == action.payload.photo.id
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
        (photo) => photo.id == action.payload.photo.id
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

      const ids: string[] = action.payload.photos.map(
        (photo: PhotoType) => photo.id
      );

      newState.photosLocal = newState.photosLocal.filter(
        (photo) => !ids.includes(photo.id)
      );

      return newState;
    }

    case Actions.deletePhotosLocalFromServer: {
      const newState = { ...prevState };

      const newPhotosServer = [...newState.photosServer];

      const ids: string[] = action.payload.photos.map(
        (photo: PhotoType) => photo.id
      );

      ids.forEach((id) => {
        const photo = newPhotosServer.find((v) => v.id == id);
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
        (photo) => !action.payload.ids.includes(photo.id)
      );

      return newState;
    }

    case Actions.updatePhotoProgress: {
      const newState = { ...prevState };
      const newPhotosLocal = [...newState.photosLocal];
      const findCorrespondingPhotoIndex = newPhotosLocal.findIndex(
        (photo) => photo.id == action.payload.photo.id
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
        const index = newPhotosServer.findIndex((v) => v.id == requestPhoto.id);

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
        (photo) => photo.id == action.payload.photo.id
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

    case Actions.setServiceAddingServerPhotos: {
      if (prevState.isServiceAddingServerPhotos == action.payload.isServiceOn) {
        return prevState;
      }
      const newState = { ...prevState };
      newState.isServiceAddingServerPhotos = action.payload.isServiceOn;
      return newState;
    }

    case Actions.updatePhotosFromService: {
      const newState = { ...prevState };
      const newPhotosLocal = [...newState.photosLocal];

      action.payload.ids.forEach((id: string, i: number) => {
        const index = newState.photosLocalIdMap.get(id);

        if (index === undefined) {
          return;
        }

        if (false && i < action.payload.current) {
          newPhotosLocal.splice(index, 1);
        } else {
          if (!newPhotosLocal[index].isLoading) {
            const newPhoto = { ...newPhotosLocal[index] };
            newPhoto.isLoading = true;
            newPhoto.loadingPercentage = 0;
            newPhotosLocal[index] = newPhoto;
          }
        }
      });

      newState.photosLocal = newPhotosLocal;
      return newState;
    }
  }
  return prevState;
}

export { GlobalReducer, initialState, Actions };
export type { Action };
