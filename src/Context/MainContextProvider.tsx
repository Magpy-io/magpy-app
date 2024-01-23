import React, { ReactNode, createContext, useContext } from 'react';

import MainContextEffects from './MainContextEffects';
import { PhotosDataType, usePhotosData } from './PhotosContext/usePhotos';
import { BackgroundServiceDataType, useBackgroundServiceData } from './useBackgroundService';
import { PhotosDownloadingDataType, usePhotosDownloadingData } from './usePhotosDownloading';

export type PhotosContextType = {
  photosData: PhotosDataType;
  backgroundServiceData: BackgroundServiceDataType;
  photosDownloadingData: PhotosDownloadingDataType;
};

const AppContext = createContext<PhotosContextType | undefined>(undefined);

type PropsType = {
  children: ReactNode;
};

const ContextProvider: React.FC<PropsType> = props => {
  const photosData = usePhotosData();
  const backgroundServiceData = useBackgroundServiceData();
  const photosDownloadingData = usePhotosDownloadingData();

  const value = {
    photosData,
    backgroundServiceData,
    photosDownloadingData,
  };

  return (
    <AppContext.Provider value={value}>
      <MainContextEffects>{props.children}</MainContextEffects>
    </AppContext.Provider>
  );
};

function useMainContext() {
  return useContext(AppContext) as PhotosContextType;
}

export { ContextProvider, useMainContext };
