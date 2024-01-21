import React, { ReactNode, createContext, useContext, useReducer } from 'react';

import {
  Action,
  GlobalReducer,
  PhotosStateType,
  initialState,
} from '~/Context/ContextReducer';

import { BackgroundServiceDataType, useBackgroundServiceData } from './useBackgroundService';
import { PhotosDownloadingDataType, usePhotosDownloadingData } from './usePhotosDownloading';

export type PhotosContextType = {
  photosState: PhotosStateType;
  photosDispatch: React.Dispatch<Action>;
  backgroundServiceData: BackgroundServiceDataType;
  photosDownloadingData: PhotosDownloadingDataType;
};

const AppContext = createContext<PhotosContextType | undefined>(undefined);

type PropsType = {
  children: ReactNode;
};

const ContextProvider = (props: PropsType) => {
  const [state, dispatch] = useReducer(GlobalReducer, initialState);

  const backgroundServiceData = useBackgroundServiceData();
  //useBackgroundServiceEffects();

  const photosDownloadingData = usePhotosDownloadingData();

  const value = {
    photosState: state,
    photosDispatch: dispatch,
    backgroundServiceData,
    photosDownloadingData,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

function useMainContext() {
  return useContext(AppContext) as PhotosContextType;
}

export { ContextProvider, useMainContext };
