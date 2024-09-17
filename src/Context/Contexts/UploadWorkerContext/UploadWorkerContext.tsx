import React, { ReactNode, createContext, useContext, useState } from 'react';

import { UploadWorkerEffects } from './UploadWorkerEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type UploadWorkerDataType = {
  currentPhotosUploading: Set<string>;
  queuedPhotosToUpload: Set<string>;
  setCurrentPhotosUploading: SetStateType<Set<string>>;
  setQueuedPhotosToUpload: SetStateType<Set<string>>;
};

const initialState: UploadWorkerDataType = {
  currentPhotosUploading: new Set(),
  queuedPhotosToUpload: new Set(),
  setCurrentPhotosUploading: () => {},
  setQueuedPhotosToUpload: () => {},
};

const UploadWorkerContext = createContext<UploadWorkerDataType>(initialState);

type PropsType = {
  children: ReactNode;
};

export const UploadWorkerContextProvider: React.FC<PropsType> = props => {
  const [currentPhotosUploading, setCurrentPhotosUploading] = useState(new Set<string>());
  const [queuedPhotosToUpload, setQueuedPhotosToUpload] = useState(new Set<string>());

  return (
    <UploadWorkerContext.Provider
      value={{
        currentPhotosUploading,
        queuedPhotosToUpload,
        setCurrentPhotosUploading,
        setQueuedPhotosToUpload,
      }}>
      <UploadWorkerEffects>{props.children}</UploadWorkerEffects>
    </UploadWorkerContext.Provider>
  );
};

export function useUploadWorkerContext(): UploadWorkerDataType {
  const context = useContext(UploadWorkerContext);

  if (!context) {
    throw new Error('UploadWorkerContext not defined');
  }

  return context;
}
