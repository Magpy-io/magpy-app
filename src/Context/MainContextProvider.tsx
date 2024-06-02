import React, { ReactNode, createContext, useContext } from 'react';

import PhotosDownloadingProvider from './Contexts/PhotosDownloadingContext/PhotosDownloadingContext';
import { ServerDataType, useServerData } from './Contexts/ServerContext';

export type PhotosContextType = {
  serverData: ServerDataType;
};

const AppContext = createContext<PhotosContextType | undefined>(undefined);

type PropsType = {
  children: ReactNode;
};

const ContextProvider: React.FC<PropsType> = props => {
  const serverData = useServerData();

  const value = {
    serverData,
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
