import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
} from "react";

import RNFS from "react-native-fs";
import { ErrorCodes } from "react-native-delete-media";

import { PhotoType } from "~/Helpers/types";

import {
  GetMorePhotosLocal,
  GetMorePhotosServer,
} from "~/Helpers/GetMorePhotos";

import {
  postPhoto,
  postPhotoWithProgress,
  getPhotoById,
  removePhotosById,
  updatePhotoPath,
  getPhotosByIds,
  getPhotoWithProgress,
} from "~/Helpers/Queries";
import {
  addPhoto,
  RemovePhotos,
  getFirstPossibleFileName,
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
};

const ITEMS_TO_LOAD_PER_END_REACHED_LOCAL = 3000;

const ITEMS_TO_LOAD_PER_END_REACHED_SERVER = 3000;

const addSinglePhotoServer = async (
  photo: PhotoType,
  dispatch: React.Dispatch<Action>
) => {
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
        payload: { photo: photo, isLoading: true, p: (p + 1) / t },
      });
    }
  );

  if (!response.ok) {
    console.log(response);
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
  let image64;

  if (photo.image.image64Full) {
    image64 = photo.image.image64Full.substring(
      "data:image/jpeg;base64,".length
    );
  } else {
    const result = await getPhotoWithProgress(
      photo.id,
      (p: number, t: number) => {
        dispatch({
          type: Actions.updatePhotoProgressServer,
          payload: { photo: photo, isLoading: true, p: (p + 1) / t },
        });
      }
    );
    if (!result.ok) {
      console.log(result);
      return;
    }
    image64 = result.data.photo.image64;
  }

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
  dispatch({
    type: Actions.updatePhotoProgressServer,
    payload: { photo: photo, isLoading: false, p: 0 },
  });
  const result = await updatePhotoPath(photo.id, filePath);

  if (!result.ok) {
    console.log(result);
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
    if (photo.image.image64Full) {
      return;
    }
    try {
      const result = await getPhotoById(photo.id);

      if (!result.ok) {
        console.log(result);
        return;
      }

      dispatch({
        type: Actions.addFullPhotoById,
        payload: { result: result },
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const RequestCroppedPhotosServer = useCallback(
    async (photos: PhotoType[]) => {
      try {
        const ids = photos.map((photo) => photo.id);
        const result = await getPhotosByIds(ids);

        if (!result.ok) {
          console.log(result);
          return;
        }

        const images64 = result.data.photos;
        const images64Filtered = images64.filter(
          (image64: any) => image64.exists
        );
        dispatch({
          type: Actions.addCroppedPhotos,
          payload: { images64: images64Filtered },
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

      const response = await removePhotosById(ids);

      if (!response.ok) {
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

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
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

function useMainContext() {
  return useContext(AppContext) as contextType;
}

export { ContextProvider, useMainContext };
