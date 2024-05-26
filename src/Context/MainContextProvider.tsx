import React, { ReactNode, createContext, useContext } from 'react';

import { LocalServersDataType, useLocalServersData } from './Contexts/LocalServersContext';
import PhotosDownloadingProvider from './Contexts/PhotosDownloadingContext/PhotosDownloadingContext';
import { ServerClaimDataType, useServerClaimData } from './Contexts/ServerClaimContext';
import { ServerDataType, useServerData } from './Contexts/ServerContext';

export type PhotosContextType = {
  serverClaimData: ServerClaimDataType;
  serverData: ServerDataType;
  localServersData: LocalServersDataType;
};

const AppContext = createContext<PhotosContextType | undefined>(undefined);

type PropsType = {
  children: ReactNode;
};

const ContextProvider: React.FC<PropsType> = props => {
  const serverClaimData = useServerClaimData();
  const serverData = useServerData();
  const localServersData = useLocalServersData();

  const value = {
    serverClaimData,
    serverData,
    localServersData,
  };

  return (
    <AppContext.Provider value={value}>
      <PhotosDownloadingProvider>{props.children}</PhotosDownloadingProvider>
    </AppContext.Provider>
  );
};

function useMainContext(): PhotosContextType {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('Context not defined');
  }

  return context;
}

export { ContextProvider, useMainContext };
