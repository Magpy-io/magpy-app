import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
} from "react";

import { NativeModules } from "react-native";
const { MainModule } = NativeModules;

import RNFS from "react-native-fs";
import { ErrorCodes } from "react-native-delete-media";

import { PhotoType } from "~/Helpers/types";

import {
  GetMorePhotosLocal,
  GetMorePhotosServer,
} from "~/Helpers/GetMorePhotos";

import * as Queries from "~/Helpers/Queries";
import {
  addPhoto,
  RemovePhotos,
  clearCache,
  addPhotoToCache,
} from "~/Helpers/GetGalleryPhotos";

import {
  GlobalReducer,
  initialState,
  Actions,
  Action,
} from "~/Components/ContextReducer";

type contextType = {
  photosLocal: Array<PhotoType>;
  photosServer: Array<PhotoType>;
  onRefreshLocal: () => Promise<void>;
  onRefreshServer: () => Promise<void>;
  fetchMoreLocal: () => Promise<void>;
  fetchMoreServer: () => Promise<void>;
  RequestFullPhotoServer: (photo: PhotoType) => Promise<void>;
  addPhotosLocal: (photos: PhotoType[]) => Promise<void>;
  addPhotosServer: (photos: PhotoType[]) => Promise<void>;
  deletePhotosLocalFromLocal: (photos: PhotoType[]) => Promise<void>;
  deletePhotoLocalFromServer: (photo: PhotoType) => Promise<void>;
  deletePhotosLocalFromServer: (photos: PhotoType[]) => Promise<void>;
  deletePhotosServer: (photos: PhotoType[]) => Promise<void>;
  refreshPhotosAddingServer: () => Promise<void>;
};

const ITEMS_TO_LOAD_PER_END_REACHED_LOCAL = 3000;

const ITEMS_TO_LOAD_PER_END_REACHED_SERVER = 3000;

const addSinglePhotoServer = async (
  photo: PhotoType,
  dispatch: React.Dispatch<Action>
) => {
  const res = await RNFS.readFile(photo.image.path, "base64");

  const result = await Queries.addPhotoWithProgress(
    {
      name: photo.image.fileName,
      fileSize: photo.image.fileSize,
      width: photo.image.width,
      height: photo.image.height,
      date: new Date(photo.created).toJSON(),
      path: photo.image.path,
      image64: res,
    },
    (p: number, t: number) => {
      dispatch({
        type: Actions.updatePhotoProgress,
        payload: { photo: photo, isLoading: true, p: (p + 1) / t },
      });
    }
  );

  if (result.error) {
    console.log(result.error);
    return;
  }

  dispatch({
    type: Actions.addPhotoServer,
    payload: { photo: photo },
  });
};

const addSinglePhotoLocal = async (
  photo: PhotoType,
  dispatch: React.Dispatch<Action>
) => {
  const result = await Queries.getPhotoWithProgress(
    photo.id,
    (p: number, t: number) => {
      dispatch({
        type: Actions.updatePhotoProgressServer,
        payload: { photo: photo, isLoading: true, p: (p + 1) / t },
      });
    }
  );

  if (result.error) {
    console.log(result.error);
    return;
  }

  const image64 = result.photo.image64;
  const newUri = await addPhoto(photo, image64);

  photo.image.path = newUri;
  dispatch({ type: Actions.addPhotoLocal, payload: { photo: photo } });
  dispatch({
    type: Actions.updatePhotoProgressServer,
    payload: { photo: photo, isLoading: false, p: 0 },
  });

  const result1 = await Queries.updatePhotoPath(photo.id, newUri);

  if (result1.error) {
    console.log(result1.error);
    return;
  }
};

const AppContext = createContext<contextType | undefined>(undefined);

type PropsType = {
  children: any;
};

const ContextProvider = (props: PropsType) => {
  const [state, dispatch] = useReducer(GlobalReducer, initialState);

  const photosUploading = useRef([] as PhotoType[]);
  const isPhotosUploading = useRef(false);

  const photosDownloading = useRef([] as PhotoType[]);
  const isPhotosDownloading = useRef(false);

  const onRefreshLocal = useCallback(async () => {
    try {
      const newPhotos = await GetMorePhotosLocal(
        ITEMS_TO_LOAD_PER_END_REACHED_LOCAL,
        0
      );
      dispatch({
        type: Actions.setNewPhotosLocal,
        payload: { newPhotos: newPhotos },
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const onRefreshServer = useCallback(async () => {
    try {
      await clearCache();
      const newPhotos = await GetMorePhotosServer(
        ITEMS_TO_LOAD_PER_END_REACHED_SERVER,
        0
      );

      dispatch({
        type: Actions.setNewPhotosServer,
        payload: { newPhotos: newPhotos },
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchMoreLocal = useCallback(async () => {
    try {
      if (state.endReachedLocal) {
        return;
      }

      const newPhotos = await GetMorePhotosLocal(
        ITEMS_TO_LOAD_PER_END_REACHED_LOCAL,
        state.nextOffsetLocal
      );

      dispatch({
        type: Actions.addToPhotosLocal,
        payload: { newPhotos: newPhotos },
      });
    } catch (err) {
      console.log(err);
    }
  }, [state]);

  const fetchMoreServer = useCallback(async () => {
    try {
      if (state.endReachedServer) {
        return;
      }

      const newPhotos = await GetMorePhotosServer(
        ITEMS_TO_LOAD_PER_END_REACHED_SERVER,
        state.nextOffsetServer
      );

      dispatch({
        type: Actions.addToPhotosServer,
        payload: { newPhotos: newPhotos },
      });
    } catch (err) {
      console.log(err);
    }
  }, [state]);

  const RequestFullPhotoServer = useCallback(async (photo: PhotoType) => {
    if (photo.image.pathCache) {
      return;
    }
    try {
      const result = await Queries.getPhotosById([photo.id], "compressed");

      if (result.error) {
        console.log(result.error);
        return;
      }

      if (!result.photos[0].exists) {
        console.log(`Photo with id ${photo.id} not found`);
        console.log(result);
        return;
      }

      const pathCache = await addPhotoToCache(
        photo.image.fileName,
        result.photos[0].photo?.image64 as string
      );
      photo.image.pathCache = pathCache;
      dispatch({
        type: Actions.addFullPhotoById,
        payload: { photo: photo },
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const RequestCroppedPhotosServer = useCallback(
    async (photos: PhotoType[]) => {
      try {
        const ids = photos.map((photo) => photo.id);
        const result = await Queries.getPhotosById(ids, "thumbnail");

        if (result.error) {
          console.log(result.error);
          return;
        }

        const photosWithImage64 = result.photos;
        const photosWithImage64Filtered = photosWithImage64.filter(
          (image64) => image64.exists
        );

        const images64 = photosWithImage64Filtered.map((v) => {
          return { id: v.photo?.id, image64: v.photo?.image64 };
        });

        dispatch({
          type: Actions.addCroppedPhotos,
          payload: { images64: images64 },
        });
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const addPhotosLocal = useCallback(async (photos: PhotoType[]) => {
    try {
      for (let i = 0; i < photos.length; i++) {
        if (!photos[i].isLoading && !photos[i].inDevice) {
          dispatch({
            type: Actions.updatePhotoProgressServer,
            payload: { photo: photos[i], isLoading: true, p: 0 },
          });
          photosDownloading.current.push(photos[i]);
        }
      }

      if (isPhotosDownloading.current) {
        return;
      }

      while (photosDownloading.current.length != 0) {
        isPhotosDownloading.current = true;
        const photo = photosDownloading.current.shift() as PhotoType;
        try {
          await addSinglePhotoLocal(photo, dispatch);
        } catch (err) {
          console.log(`error while downloading photo with id ${photo.id}`);
          console.log(err);
        }
      }
      isPhotosDownloading.current = false;
    } catch (err) {
      console.log(err);
    }
  }, []);

  const addPhotosServer = useCallback(async (photos: PhotoType[]) => {
    try {
      MainModule.startSendingMediaService(
        photos.map((p) => {
          return {
            id: p.id,
            name: p.image.fileName,
            date: new Date(p.created).toJSON(),
            path: p.image.path,
            width: p.image.width,
            height: p.image.height,
            size: p.image.fileSize,
          };
        })
      );

      dispatch({
        type: Actions.setServiceAddingServerPhotos,
        payload: { isServiceOn: true },
      });

      for (let i = 0; i < photos.length; i++) {
        if (!photos[i].isLoading) {
          dispatch({
            type: Actions.updatePhotoProgress,
            payload: { photo: photos[i], isLoading: true, p: 0 },
          });
          photosUploading.current.push(photos[i]);
        }
      }
    } catch (err) {
      console.log(err);
    }

    return;
    try {
      for (let i = 0; i < photos.length; i++) {
        if (!photos[i].isLoading) {
          dispatch({
            type: Actions.updatePhotoProgress,
            payload: { photo: photos[i], isLoading: true, p: 0 },
          });
          photosUploading.current.push(photos[i]);
        }
      }

      if (isPhotosUploading.current) {
        return;
      }

      while (photosUploading.current.length != 0) {
        isPhotosUploading.current = true;
        const photo = photosUploading.current.shift() as PhotoType;
        try {
          await addSinglePhotoServer(photo, dispatch);
        } catch (err) {
          console.log(`error while posting photo with id ${photo.id}`);
          console.log(err);
        }
      }
      isPhotosUploading.current = false;
    } catch (err) {
      console.log(err);
    }
  }, []);

  const deletePhotosLocalFromLocal = useCallback(
    async (photos: PhotoType[]) => {
      try {
        const uris = photos.map((photo) => photo.image.path);
        let photosRemoved = true;

        try {
          await RemovePhotos(uris);
        } catch (err: any) {
          photosRemoved = false;
          const code: ErrorCodes = err.code;

          if (code != "ERROR_USER_REJECTED") {
            throw err;
          }
        }

        if (photosRemoved) {
          dispatch({
            type: Actions.deletePhotosLocalFromLocal,
            payload: { photos: photos },
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const deletePhotoLocalFromServer = useCallback(async (photo: PhotoType) => {
    try {
      RequestFullPhotoServer(photo);

      let photoRemoved = true;

      try {
        await RemovePhotos([photo.image.path]);
      } catch (err: any) {
        photoRemoved = false;
        const code: ErrorCodes = err.code;

        if (code != "ERROR_USER_REJECTED") {
          throw err;
        }
      }
      if (photoRemoved) {
        dispatch({
          type: Actions.deletePhotosLocalFromServer,
          payload: { photos: [photo] },
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const deletePhotosLocalFromServer = useCallback(
    async (photos: PhotoType[]) => {
      try {
        RequestCroppedPhotosServer(photos);

        const uris = photos.map((photo) => photo.image.path);

        let photosRemoved = true;

        try {
          await RemovePhotos(uris);
        } catch (err: any) {
          photosRemoved = false;
          const code: ErrorCodes = err.code;

          if (code != "ERROR_USER_REJECTED") {
            throw err;
          }
        }

        if (photosRemoved) {
          dispatch({
            type: Actions.deletePhotosLocalFromServer,
            payload: { photos: photos },
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const deletePhotosServer = useCallback(async (photos: PhotoType[]) => {
    try {
      const ids = photos.map((photo) => photo.id);

      dispatch({
        type: Actions.deletePhotosServer,
        payload: { ids: ids },
      });

      const result = await Queries.deletePhotosById(ids);

      if (result.error) {
        console.log(result.error);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const refreshPhotosAddingServer = useCallback(async () => {
    try {
      if (!state.isServiceAddingServerPhotos) {
        return;
      }

      if (!(await MainModule.isServiceRunning())) {
        dispatch({
          type: Actions.setServiceAddingServerPhotos,
          payload: { isServiceOn: false },
        });
        return;
      }

      const ids = await MainModule.getIds();
      const currentIndex = await MainModule.getCurrentIndex();

      for (let i = 0; i < ids.length; i++) {
        const photo = state.photosLocal.find((v) => v.id == ids[i]);

        if (!photo) {
          continue;
        }

        if (i < currentIndex) {
          dispatch({
            type: Actions.addPhotoServer,
            payload: { photo: photo },
          });
        } else {
          dispatch({
            type: Actions.updatePhotoProgress,
            payload: { photo: photo, isLoading: true, p: 0 },
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [state]);

  const value = {
    photosLocal: state.photosLocal,
    photosServer: state.photosServer,
    onRefreshLocal: onRefreshLocal,
    onRefreshServer: onRefreshServer,
    fetchMoreLocal: fetchMoreLocal,
    fetchMoreServer: fetchMoreServer,
    RequestFullPhotoServer: RequestFullPhotoServer,
    addPhotosLocal: addPhotosLocal,
    addPhotosServer: addPhotosServer,
    deletePhotosLocalFromLocal: deletePhotosLocalFromLocal,
    deletePhotoLocalFromServer: deletePhotoLocalFromServer,
    deletePhotosLocalFromServer: deletePhotosLocalFromServer,
    deletePhotosServer: deletePhotosServer,
    refreshPhotosAddingServer: refreshPhotosAddingServer,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

function useMainContext() {
  return useContext(AppContext) as contextType;
}

export { ContextProvider, useMainContext };
