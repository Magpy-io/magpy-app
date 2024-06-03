import React, { ReactNode, createContext, useContext, useReducer } from 'react';

import { Actions } from './PhotosDownloadingActions';
import { PhotosDownloadingEffects } from './PhotosDownloadingEffects';
import { PhotosDownloadingStateType, Reducer, initialState } from './PhotosDownloadingReducer';

export type PhotosDownloadingDispatchType = React.Dispatch<Actions>;

const PhotosDownloadingContext = createContext<PhotosDownloadingStateType>(initialState);

const PhotosDownloadingDispatch = createContext<PhotosDownloadingDispatchType>(() => {});

type PropsType = {
  children: ReactNode;
};

export const PhotosDownloadingContextProvider: React.FC<PropsType> = props => {
  const [photosDownloadingState, photosDownloadingDispatch] = useReducer(
    Reducer,
    initialState,
  );

  return (
    <PhotosDownloadingContext.Provider value={photosDownloadingState}>
      <PhotosDownloadingDispatch.Provider value={photosDownloadingDispatch}>
        <PhotosDownloadingEffects>{props.children}</PhotosDownloadingEffects>
      </PhotosDownloadingDispatch.Provider>
    </PhotosDownloadingContext.Provider>
  );
};

export function usePhotosDownloadingContext(): PhotosDownloadingStateType {
  const context = useContext(PhotosDownloadingContext);

  if (!context) {
    throw new Error('PhotosDownloadingContext not defined');
  }

  return context;
}

export function usePhotosDownloadingDispatch(): PhotosDownloadingDispatchType {
  const context = useContext(PhotosDownloadingDispatch);

  if (!context) {
    throw new Error('PhotosDownloadingContext not defined');
  }

  return context;
}
