import React, { ReactNode, createContext, useContext, useState } from 'react';

import { BackupWorkerEffect } from './BackupWorkerEffect';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type BackupWorkerDataType = {
  autobackupEnabled: boolean;
};

const initialState: BackupWorkerDataType = {
  autobackupEnabled: false,
};

export type BackupWorkerDataSettersType = {
  setAutobackupEnabled: SetStateType<boolean>;
};

const initialStateSetters: BackupWorkerDataSettersType = {
  setAutobackupEnabled: () => {},
};

const BackupWorkerContext = createContext<BackupWorkerDataType>(initialState);
const BackupWorkerContextSetters =
  createContext<BackupWorkerDataSettersType>(initialStateSetters);

type PropsType = {
  children: ReactNode;
};

export const BackupWorkerContextProvider: React.FC<PropsType> = props => {
  const [autobackupEnabled, setAutobackupEnabled] = useState(false);
  return (
    <BackupWorkerContext.Provider value={{ autobackupEnabled }}>
      <BackupWorkerContextSetters.Provider value={{ setAutobackupEnabled }}>
        <BackupWorkerEffect>{props.children}</BackupWorkerEffect>
      </BackupWorkerContextSetters.Provider>
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

export function useBackupWorkerContextSettersInner(): BackupWorkerDataSettersType {
  const context = useContext(BackupWorkerContextSetters);

  if (!context) {
    throw new Error('BackupWorkerContext not defined');
  }

  return context;
}
