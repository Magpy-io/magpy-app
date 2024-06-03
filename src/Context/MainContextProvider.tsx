import React, { ReactNode, createContext, useContext } from 'react';

import PhotosDownloadingProvider from './Contexts/PhotosDownloadingContext/PhotosDownloadingContext';

export type PhotosContextType = null;

const AppContext = createContext<PhotosContextType | undefined>(undefined);

type PropsType = {
  children: ReactNode;
};

const ContextProvider: React.FC<PropsType> = props => {
  const value = null;

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
