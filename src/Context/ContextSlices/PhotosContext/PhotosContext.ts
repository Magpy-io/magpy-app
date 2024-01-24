import { useReducer } from 'react';

import { Action, GlobalReducer, PhotosStateType, initialState } from './PhotosReducer';

export type PhotosDataType = {
  photosState: PhotosStateType;
  photosDispatch: React.Dispatch<Action>;
};

export function usePhotosData(): PhotosDataType {
  const [photosState, photosDispatch] = useReducer(GlobalReducer, initialState);

  return { photosState, photosDispatch };
}
