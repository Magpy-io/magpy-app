import React, { ReactNode, createContext, useContext } from 'react';

import { AuthDataType, useAuthData } from './AuthContext';
import { LocalServersDataType, useLocalServersData } from './LocalServersContext';
import { PhotosDataType, usePhotosData } from './PhotosContext/usePhotos';
import { ServerClaimDataType, useServerClaimData } from './ServerClaimContext';
import { ServerDataType, useServerData } from './ServerContext';
import { BackgroundServiceDataType, useBackgroundServiceData } from './useBackgroundService';
import { PhotosDownloadingDataType, usePhotosDownloadingData } from './usePhotosDownloading';

export type PhotosContextType = {
  photosData: PhotosDataType;
  backgroundServiceData: BackgroundServiceDataType;
  photosDownloadingData: PhotosDownloadingDataType;
  serverClaim: ServerClaimDataType;
  auth: AuthDataType;
  server: ServerDataType;
  localServers: LocalServersDataType;
};

const AppContext = createContext<PhotosContextType | undefined>(undefined);

type PropsType = {
  children: ReactNode;
};

const ContextProvider: React.FC<PropsType> = props => {
  const photosData = usePhotosData();
  const backgroundServiceData = useBackgroundServiceData();
  const photosDownloadingData = usePhotosDownloadingData();
  const serverClaim = useServerClaimData();
  const auth = useAuthData();
  const server = useServerData();
  const localServers = useLocalServersData();

  const value = {
    photosData,
    backgroundServiceData,
    photosDownloadingData,
    serverClaim,
    auth,
    server,
    localServers,
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
