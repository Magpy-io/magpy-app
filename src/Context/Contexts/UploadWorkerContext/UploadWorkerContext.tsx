import React, { ReactNode, createContext, useContext } from 'react';

import { UploadWorkerEffects } from './UploadWorkerEffects';

export type UploadWorkerDataType = null;

const UploadWorkerContext = createContext<UploadWorkerDataType>(null);

type PropsType = {
  children: ReactNode;
};

export const UploadWorkerContextProvider: React.FC<PropsType> = props => {
  return (
    <UploadWorkerContext.Provider value={null}>
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
