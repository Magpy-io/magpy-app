import React, { ReactNode, createContext, useContext } from 'react';

import { AuthDataType, useAuthData } from './ContextSlices/AuthContext';
import {
  BackgroundServiceDataType,
  useBackgroundServiceData,
} from './ContextSlices/BackgroundServiceContext';
import {
  LocalServersDataType,
  useLocalServersData,
} from './ContextSlices/LocalServersContext';
import { PhotosDataType, usePhotosData } from './ContextSlices/PhotosContext/PhotosContext';
import {
  PhotosDownloadingDataType,
  usePhotosDownloadingData,
} from './ContextSlices/PhotosDownloadingContext';
import { ServerClaimDataType, useServerClaimData } from './ContextSlices/ServerClaimContext';
import { ServerDataType, useServerData } from './ContextSlices/ServerContext';

export type PhotosContextType = {
  photosData: PhotosDataType;
  backgroundServiceData: BackgroundServiceDataType;
  photosDownloadingData: PhotosDownloadingDataType;
  serverClaimData: ServerClaimDataType;
  authData: AuthDataType;
  serverData: ServerDataType;
  localServersData: LocalServersDataType;
};

const AppContext = createContext<PhotosContextType | undefined>(undefined);

type PropsType = {
  children: ReactNode;
};

const ContextProvider: React.FC<PropsType> = props => {
  const photosData = usePhotosData();
  const backgroundServiceData = useBackgroundServiceData();
  const photosDownloadingData = usePhotosDownloadingData();
  const serverClaimData = useServerClaimData();
  const authData = useAuthData();
  const serverData = useServerData();
  const localServersData = useLocalServersData();

  const value = {
    photosData,
    backgroundServiceData,
    photosDownloadingData,
    serverClaimData,
    authData,
    serverData,
    localServersData,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

function useMainContext(): PhotosContextType {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('Context not defined');
  }

  return context;
}

export { ContextProvider, useMainContext };
