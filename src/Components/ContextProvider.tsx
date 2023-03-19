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

import { postPhoto, getPhotoById, removePhotoById } from "~/Helpers/Queries";
import { addPhoto, RemovePhoto } from "~/Helpers/GetGalleryPhotos";

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
    const newPhotos = await GetMorePhotosLocal(
      ITEMS_TO_LOAD_PER_END_REACHED_LOCAL,
      0
    );

    dispatch({
      type: Actions.setNewPhotosLocal,
      payload: { newPhotos: newPhotos },
    });
  }, [state]);

  const onRefreshServer = useCallback(async () => {
    const newPhotos = await GetMorePhotosServer(
      ITEMS_TO_LOAD_PER_END_REACHED_SERVER,
      0
    );

    dispatch({
      type: Actions.setNewPhotosServer,
      payload: { newPhotos: newPhotos },
    });
  }, [state]);

  const fetchMoreLocal = useCallback(async () => {
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
  }, [state]);

  const fetchMoreServer = useCallback(async () => {
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
  }, [state]);

  const RequestFullPhotoServer = useCallback(
    async (index: number) => {
      const photo = state.photosServer[index];

      if (photo.image.image64Full) {
        return Promise.resolve();
      }

      const result = await getPhotoById(photo.id);

      dispatch({ type: Actions.addFullPhotoById, payload: { result: result } });
    },
    [state]
  );

  const addPhotoLocal = useCallback(
    async (index: number) => {
      const photo = state.photosServer[index];

      await addPhoto(
        photo.image.path,
        photo.image.image64Full.split("data:image/jpeg;base64,")[1]
      );

      dispatch({ type: Actions.addPhotoLocal, payload: { photo: photo } });
    },
    [state]
  );

  const addPhotoServer = useCallback(
    async (index: number) => {
      const photo = state.photosLocal[index];

      const res = await RNFS.readFile(photo.image.path, "base64");

      const response = await postPhoto({
        name: photo.image.fileName,
        fileSize: photo.image.fileSize,
        width: photo.image.width,
        height: photo.image.height,
        date: new Date(photo.created).toJSON(),
        path: photo.image.path,
        image64: res,
      });

      dispatch({ type: Actions.addPhotoServer, payload: { photo: photo } });
    },
    [state]
  );

  const deletePhotoLocalFromLocal = useCallback(
    async (index: number) => {
      const photo = state.photosLocal[index];

      await RemovePhoto(photo.image.path);

      dispatch({
        type: Actions.deletePhotoLocalFromLocal,
        payload: { photo: photo },
      });
    },
    [state]
  );

  const deletePhotoLocalFromServer = useCallback(
    async (index: number) => {
      const photo = state.photosServer[index];

      RequestFullPhotoServer(index);

      await RemovePhoto(photo.image.path);

      dispatch({
        type: Actions.deletePhotoLocalFromServer,
        payload: { photo: photo },
      });
    },
    [state]
  );

  const deletePhotoServer = useCallback(
    async (index: number) => {
      const photo = state.photosServer[index];

      await removePhotoById(photo.id);

      dispatch({
        type: Actions.deletePhotoServer,
        payload: { photo: photo },
      });
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
