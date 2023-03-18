import React, {
  createContext,
  useState,
  useRef,
  MutableRefObject,
  useCallback,
  useContext,
} from "react";
import { PhotoType } from "~/Helpers/types";

import {
  GetMorePhotosLocal,
  GetMorePhotosServer,
} from "~/Helpers/GetMorePhotos";

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
  setPhotosLocal: (photos: Array<PhotoType>) => void;
};
const AppContext = createContext<stateType>(undefined);

const ITEMS_TO_LOAD_PER_END_REACHED_LOCAL = 100;

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

  const value = {
    photosLocal: photosLocal,
    photosServer: photosServer,
    endReachedLocalRef: endReachedLocal,
    endReachedServerRef: endReachedServer,
    onRefreshLocal: onRefreshLocal,
    onRefreshServer: onRefreshServer,
    fetchMoreLocal: fetchMoreLocal,
    fetchMoreServer: fetchMoreServer,
    setPhotosLocal: setPhotosLocal,
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
    };
  } else {
    //"server"
    return {
      photos: contextGlobal.photosServer,
      endReachedRef: contextGlobal.endReachedServerRef,
      onRefresh: contextGlobal.onRefreshServer,
      fetchMore: contextGlobal.fetchMoreServer,
    };
  }
}

export { ContextProvider, useSelectedContext };
export type { ContextSourceTypes };
