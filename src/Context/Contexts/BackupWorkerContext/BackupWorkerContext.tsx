import React, { ReactNode, createContext, useContext, useState } from 'react';

import { WorkerStatus } from '~/NativeModules/AutoBackupModule';

import { BackupWorkerEffect } from './BackupWorkerEffect';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type BackupWorkerDataType = {
  workerStatus?: WorkerStatus;
  setWorkerStatus: SetStateType<WorkerStatus | undefined>;
};

const initialState: BackupWorkerDataType = {
  workerStatus: undefined,
  setWorkerStatus: () => {},
};

const BackupWorkerContext = createContext<BackupWorkerDataType>(initialState);

type PropsType = {
  children: ReactNode;
};

export const BackupWorkerContextProvider: React.FC<PropsType> = props => {
  const [workerStatus, setWorkerStatus] = useState<WorkerStatus | undefined>(undefined);
  return (
    <BackupWorkerContext.Provider value={{ workerStatus, setWorkerStatus }}>
      <BackupWorkerEffect>{props.children}</BackupWorkerEffect>
    </BackupWorkerContext.Provider>
  );
};

export function useBackupWorkerContextInner(): BackupWorkerDataType {
  const context = useContext(BackupWorkerContext);

  if (!context) {
    throw new Error('BackupWorkerContext not defined');
  }

  return context;
}
