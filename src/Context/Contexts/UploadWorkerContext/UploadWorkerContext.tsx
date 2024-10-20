import React, { ReactNode, createContext, useContext, useState } from 'react';

import { WorkerStatus } from '~/NativeModules/UploadMediaModule';

import { UploadWorkerEffects } from './UploadWorkerEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type UploadWorkerDataType = {
  currentPhotosUploading: Set<string>;
  queuedPhotosToUpload: Set<string>;
  workerStatus?: WorkerStatus;
  setCurrentPhotosUploading: SetStateType<Set<string>>;
  setQueuedPhotosToUpload: SetStateType<Set<string>>;
  setWorkerStatus: SetStateType<WorkerStatus | undefined>;
};

const initialState: UploadWorkerDataType = {
  currentPhotosUploading: new Set(),
  queuedPhotosToUpload: new Set(),
  workerStatus: undefined,
  setCurrentPhotosUploading: () => {},
  setQueuedPhotosToUpload: () => {},
  setWorkerStatus: () => {},
};

const UploadWorkerContext = createContext<UploadWorkerDataType>(initialState);

type PropsType = {
  children: ReactNode;
};

export const UploadWorkerContextProvider: React.FC<PropsType> = props => {
  const [currentPhotosUploading, setCurrentPhotosUploading] = useState(new Set<string>());
  const [queuedPhotosToUpload, setQueuedPhotosToUpload] = useState(new Set<string>());
  const [workerStatus, setWorkerStatus] = useState<WorkerStatus | undefined>(undefined);

  return (
    <UploadWorkerContext.Provider
      value={{
        currentPhotosUploading,
        queuedPhotosToUpload,
        workerStatus,
        setCurrentPhotosUploading,
        setQueuedPhotosToUpload,
        setWorkerStatus,
      }}>
      <UploadWorkerEffects>{props.children}</UploadWorkerEffects>
    </UploadWorkerContext.Provider>
  );
};

export function useUploadWorkerContextInner(): UploadWorkerDataType {
  const context = useContext(UploadWorkerContext);

  if (!context) {
    throw new Error('UploadWorkerContext not defined');
  }

  return context;
}
