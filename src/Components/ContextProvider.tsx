import React, {
  createContext,
  useState,
  useRef,
  MutableRefObject,
  useCallback,
  useContext,
} from "react";

import RNFS from "react-native-fs";

import { PhotoType } from "~/Helpers/types";

import {
  GetMorePhotosLocal,
  GetMorePhotosServer,
} from "~/Helpers/GetMorePhotos";

import { postPhoto, getPhotoById, removePhotoById } from "~/Helpers/Queries";
import { addPhoto, RemovePhoto } from "~/Helpers/GetGalleryPhotos";

type ContextSourceTypes = "local" | "server";

type stateType = {
  photosLocal: Array<PhotoType>;
  photosServer: Array<PhotoType>;
  endReachedLocalRef: MutableRefObject<boolean>;
  endReachedServerRef: MutableRefObject<boolean>;
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
const AppContext = createContext<stateType>(undefined);

const ITEMS_TO_LOAD_PER_END_REACHED_LOCAL = 30;

const ITEMS_TO_LOAD_PER_END_REACHED_SERVER = 100;

type PropsType = {
  children: any;
};

const ContextProvider = (props: PropsType) => {
  const [photosLocal, setPhotosLocal] = useState<PhotoType[]>([]);
  const nextOffsetLocal = useRef(0);
  const isFetchingLocal = useRef(false);
  const endReachedLocal = useRef(false);

  const [photosServer, setPhotosServer] = useState<PhotoType[]>([]);
  const nextOffsetServer = useRef(0);
  const isFetchingServer = useRef(false);
  const endReachedServer = useRef(false);

  const onRefreshLocal = useCallback(async () => {
    if (!isFetchingLocal.current) {
      isFetchingLocal.current = true;
      const newPhotos = await GetMorePhotosLocal(
        ITEMS_TO_LOAD_PER_END_REACHED_LOCAL,
        0
      );

      nextOffsetLocal.current = newPhotos.nextOffset;
      endReachedLocal.current = newPhotos.endReached;
      setPhotosLocal(newPhotos.photos);
      isFetchingLocal.current = false;
    }
  }, []);

  const onRefreshServer = useCallback(async () => {
    if (!isFetchingServer.current) {
      isFetchingServer.current = true;
      const newPhotos = await GetMorePhotosServer(
        ITEMS_TO_LOAD_PER_END_REACHED_SERVER,
        0
      );

      nextOffsetServer.current = newPhotos.nextOffset;
      endReachedServer.current = newPhotos.endReached;
      setPhotosServer(newPhotos.photos);
      isFetchingServer.current = false;
    }
  }, []);

  const fetchMoreLocal = useCallback(async () => {
    if (endReachedLocal.current) {
      return;
    }

    if (!isFetchingLocal.current) {
      isFetchingLocal.current = true;
      const newPhotos = await GetMorePhotosLocal(
        ITEMS_TO_LOAD_PER_END_REACHED_LOCAL,
        nextOffsetLocal.current
      );

      nextOffsetLocal.current = newPhotos.nextOffset;
      endReachedLocal.current = newPhotos.endReached;
      setPhotosLocal([...photosLocal, ...newPhotos.photos]);
      isFetchingLocal.current = false;
    }
  }, [photosLocal]);

  const fetchMoreServer = useCallback(async () => {
    if (endReachedServer.current) {
      return;
    }

    if (!isFetchingServer.current) {
      isFetchingServer.current = true;
      const newPhotos = await GetMorePhotosServer(
        ITEMS_TO_LOAD_PER_END_REACHED_SERVER,
        nextOffsetServer.current
      );

      nextOffsetServer.current = newPhotos.nextOffset;
      endReachedServer.current = newPhotos.endReached;
      setPhotosServer([...photosServer, ...newPhotos.photos]);
      isFetchingServer.current = false;
    }
  }, [photosServer]);

  const RequestFullPhotoServer = useCallback(
    (index: number) => {
      const photo = photosServer[index];
      if (photo.image.image64Full) {
        return Promise.resolve();
      }
      return getPhotoById(photo.id)
        .then((r) => {
          const newPhotos = [...photosServer];
          newPhotos[
            index
          ].image.image64Full = `data:image/jpeg;base64,${r.data.photo.image64}`;
          setPhotosServer(newPhotos);
        })
        .catch((err: any) => console.log(err));
    },
    [photosServer]
  );

  const addPhotoLocal = useCallback(
    (index: number) => {
      const photo = photosServer[index];

      return addPhoto(
        photo.image.path,
        photo.image.image64Full.split("data:image/jpeg;base64,")[1]
      ).then(() => {
        const newPhotos = [...photosServer];
        newPhotos[index].inDevice = true;
        setPhotosServer(newPhotos);
      });
    },
    [photosServer]
  );

  const addPhotoServer = useCallback(
    (index: number) => {
      const photo = photosLocal[index];
      return RNFS.readFile(photo.image.path, "base64")
        .then((res: string) => {
          return postPhoto({
            name: photo.image.fileName,
            fileSize: photo.image.fileSize,
            width: photo.image.width,
            height: photo.image.height,
            date: new Date(photo.created).toJSON(),
            path: photo.image.path,
            image64: res,
          });
        })
        .then((response: any) => {
          const newPhotos = [...photosLocal];
          newPhotos.splice(index, 1);
          setPhotosLocal(newPhotos);
        })
        .catch((err: any) => console.log(err));
    },
    [photosLocal]
  );

  const deletePhotoLocalFromLocal = useCallback(
    (index: number) => {
      const photo = photosLocal[index];

      return RemovePhoto(photo.image.path)
        .then(() => {
          const newPhotos = [...photosLocal];
          newPhotos.splice(index, 1);
          setPhotosLocal(newPhotos);
        })
        .catch((err: any) => console.log(err));
    },
    [photosLocal]
  );

  const deletePhotoLocalFromServer = useCallback(
    (index: number) => {
      const photo = photosServer[index];

      RequestFullPhotoServer(index);

      return RemovePhoto(photo.image.path)
        .then(() => {
          const newPhotos = [...photosServer];
          newPhotos[index].inDevice = false;
          setPhotosServer(newPhotos);
        })
        .catch((err: any) => console.log(err));
    },
    [photosServer]
  );

  const deletePhotoServer = useCallback(
    (index: number) => {
      const photo = photosServer[index];
      return removePhotoById(photo.id)
        .then(() => {
          const newPhotos = [...photosServer];
          newPhotos.splice(index, 1);
          setPhotosServer(newPhotos);
        })
        .catch((err: any) => console.log(err));
    },
    [photosServer]
  );

  const value = {
    photosLocal: photosLocal,
    photosServer: photosServer,
    endReachedLocalRef: endReachedLocal,
    endReachedServerRef: endReachedServer,
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

function useSelectedContext(type: ContextSourceTypes) {
  const contextGlobal = useContext(AppContext);

  if (type == "local") {
    return {
      photos: contextGlobal.photosLocal,
      endReachedRef: contextGlobal.endReachedLocalRef,
      onRefresh: contextGlobal.onRefreshLocal,
      fetchMore: contextGlobal.fetchMoreLocal,
      RequestFullPhoto: contextGlobal.RequestFullPhotoServer,
      addPhotoLocal: contextGlobal.addPhotoLocal,
      addPhotoServer: contextGlobal.addPhotoServer,
      deletePhotoLocal: contextGlobal.deletePhotoLocalFromLocal,
      deletePhotoServer: contextGlobal.deletePhotoServer,
    };
  } else {
    //"server"
    return {
      photos: contextGlobal.photosServer,
      endReachedRef: contextGlobal.endReachedServerRef,
      onRefresh: contextGlobal.onRefreshServer,
      fetchMore: contextGlobal.fetchMoreServer,
      RequestFullPhoto: contextGlobal.RequestFullPhotoServer,
      addPhotoLocal: contextGlobal.addPhotoLocal,
      addPhotoServer: contextGlobal.addPhotoServer,
      deletePhotoLocal: contextGlobal.deletePhotoLocalFromServer,
      deletePhotoServer: contextGlobal.deletePhotoServer,
    };
  }
}

export { ContextProvider, useSelectedContext };
export type { ContextSourceTypes };
