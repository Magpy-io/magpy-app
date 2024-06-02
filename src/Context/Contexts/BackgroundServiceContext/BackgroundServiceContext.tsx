import React, { ReactNode, createContext, useContext } from 'react';

import { BackgroundServiceEffects } from './BackgroundServiceEffects';

export type BackgroundServiceDataType = null;

const BackgroundServiceContext = createContext<BackgroundServiceDataType>(null);

type PropsType = {
  children: ReactNode;
};

export const BackgroundServiceContextProvider: React.FC<PropsType> = props => {
  return (
    <BackgroundServiceContext.Provider value={null}>
      <BackgroundServiceEffects>{props.children}</BackgroundServiceEffects>
    </BackgroundServiceContext.Provider>
  );
};

export function useBackgroundServiceContext(): BackgroundServiceDataType {
  const context = useContext(BackgroundServiceContext);

  if (!context) {
    throw new Error('BackgroundServiceContext not defined');
  }

  return context;
}
