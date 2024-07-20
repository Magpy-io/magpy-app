import React, { ReactNode, createContext, useContext, useState } from 'react';

import { UploadWorkerEffects } from './UploadWorkerEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type UploadWorkerDataType = {
  photosUploaded: string[];
  setPhotosUploaded: SetStateType<string[]>;
};

const UploadWorkerContext = createContext<UploadWorkerDataType>({
  photosUploaded: [],
  setPhotosUploaded: () => {},
});

type PropsType = {
  children: ReactNode;
};

export const UploadWorkerContextProvider: React.FC<PropsType> = props => {
  const [photosUploaded, setPhotosUploaded] = useState<string[]>([]);

  return (
    <UploadWorkerContext.Provider value={{ photosUploaded, setPhotosUploaded }}>
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
