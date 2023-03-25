import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";

import RNFS from "react-native-fs";

import { PhotoType } from "~/Helpers/types";

import {
  GetMorePhotosLocal,
  GetMorePhotosServer,
} from "~/Helpers/GetMorePhotos";

import {
  postPhoto,
  postPhotoWithProgress,
  getPhotoById,
  removePhotoById,
  updatePhotoPath,
} from "~/Helpers/Queries";
import {
  addPhoto,
  RemovePhoto,
  getFirstPossibleFileName,
} from "~/Helpers/GetGalleryPhotos";

import {
  GlobalReducer,
  initialState,
  Actions,
} from "~/Components/ContextReducer";

type contextType = {
  photosLocal: Array<PhotoType>;
  photosServer: Array<PhotoType>;
  onRefreshLocal: () => Promise<void>;
  onRefreshServer: () => Promise<void>;
  fetchMoreLocal: () => Promise<void>;
  fetchMoreServer: () => Promise<void>;
  RequestFullPhotoServer: (index: number) => Promise<void>;
  addPhotoLocal: (index: number) => Promise<void>;
  addPhotoServer: (index: number) => Promise<void>;
  deletePhotoLocalFromLocal: (index: number) => Promise<void>;
  deletePhotoLocalFromServer: (index: number) => Promise<void>;
  deletePhotoServer: (index: number) => Promise<void>;
};

const ITEMS_TO_LOAD_PER_END_REACHED_LOCAL = 3000;

const ITEMS_TO_LOAD_PER_END_REACHED_SERVER = 3000;

const AppContext = createContext<contextType | undefined>(undefined);

type PropsType = {
  children: any;
};

const ContextProvider = (props: PropsType) => {
  const [state, dispatch] = useReducer(GlobalReducer, initialState);

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

  const RequestFullPhotoServer = useCallback(
    async (index: number) => {
      const photo = state.photosServer[index];

      if (photo.image.image64Full) {
        return;
      }
      try {
        const result = await getPhotoById(photo.id);

        dispatch({
          type: Actions.addFullPhotoById,
          payload: { result: result },
        });
      } catch (err) {
        console.log(err);
      }
    },
    [state]
  );

  const addPhotoLocal = useCallback(
    async (index: number) => {
      try {
        const photo = state.photosServer[index];
        const image64 = photo.image.image64Full.substring(
          "data:image/jpeg;base64,".length
        );
        const dirPath = "/storage/emulated/0/DCIM/Restored/";

        await RNFS.mkdir(dirPath);

        const dirExists = await RNFS.exists(dirPath);

        if (!dirExists) {
          console.log("directory not created to write image.");
          return;
        }

        const filePath = await getFirstPossibleFileName(
          "file://" + dirPath + photo.image.fileName
        );

        await addPhoto(filePath, image64);

        photo.image.path = filePath;
        dispatch({ type: Actions.addPhotoLocal, payload: { photo: photo } });
        await updatePhotoPath(photo.id, filePath);
      } catch (err) {
        console.log(err);
      }
    },
    [state]
  );

  const addPhotoServer = useCallback(
    async (index: number) => {
      try {
        const photo = state.photosLocal[index];

        if (photo.isLoading) {
          return;
        }

        const res = await RNFS.readFile(photo.image.path, "base64");

        const response = await postPhotoWithProgress(
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
              payload: { photo: photo, p: (p + 1) / t },
            });
          }
        );

        if (!response.ok) {
          console.log(response);
        }

        dispatch({ type: Actions.addPhotoServer, payload: { photo: photo } });
      } catch (err) {
        console.log(err);
      }
    },
    [state]
  );

  const deletePhotoLocalFromLocal = useCallback(
    async (index: number) => {
      try {
        const photo = state.photosLocal[index];

        await RemovePhoto(photo.image.path);

        dispatch({
          type: Actions.deletePhotoLocalFromLocal,
          payload: { photo: photo },
        });
      } catch (err) {
        console.log(err);
      }
    },
    [state]
  );

  const deletePhotoLocalFromServer = useCallback(
    async (index: number) => {
      try {
        const photo = state.photosServer[index];

        RequestFullPhotoServer(index);

        await RemovePhoto(photo.image.path);

        dispatch({
          type: Actions.deletePhotoLocalFromServer,
          payload: { photo: photo },
        });
      } catch (err) {
        console.log(err);
      }
    },
    [state]
  );

  const deletePhotoServer = useCallback(
    async (index: number) => {
      try {
        const photo = state.photosServer[index];

        const response = await removePhotoById(photo.id);

        if (!response.ok) {
          console.log(response);
        }

        dispatch({
          type: Actions.deletePhotoServer,
          payload: { photo: photo },
        });
      } catch (err) {
        console.log(err);
      }
    },
    [state]
  );

  const value = {
    photosLocal: state.photosLocal,
    photosServer: state.photosServer,
    onRefreshLocal: onRefreshLocal,
    onRefreshServer: onRefreshServer,
    fetchMoreLocal: fetchMoreLocal,
    fetchMoreServer: fetchMoreServer,
    RequestFullPhotoServer: RequestFullPhotoServer,
    addPhotoLocal: addPhotoLocal,
    addPhotoServer: addPhotoServer,
    deletePhotoLocalFromLocal: deletePhotoLocalFromLocal,
    deletePhotoLocalFromServer: deletePhotoLocalFromServer,
    deletePhotoServer: deletePhotoServer,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

function useMainContext() {
  return useContext(AppContext) as contextType;
}

export { ContextProvider, useMainContext };
