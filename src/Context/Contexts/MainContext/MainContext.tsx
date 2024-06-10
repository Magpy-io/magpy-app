import React, { ReactNode, createContext, useContext } from 'react';

import {
  StatePersistentDefaultValue,
  StatePersistentType,
  useStatePersistent,
} from '~/Hooks/useStatePersistent';

import { MainContextEffect } from './MainContextEffect';

export type MainContextDataType = {
  isNewUserState: StatePersistentType<boolean>;
};

const initialState: MainContextDataType = {
  isNewUserState: StatePersistentDefaultValue,
};

const MainContext = createContext<MainContextDataType>(initialState);

type PropsType = {
  children: ReactNode;
};

export const MainContextProvider: React.FC<PropsType> = props => {
  const isNewUserState = useStatePersistent(true, 'ASYNC_STORAGE_KEY_IS_NEW_USER');

  return (
    <MainContext.Provider value={{ isNewUserState }}>
      <MainContextEffect>{props.children}</MainContextEffect>
    </MainContext.Provider>
  );
};

export function useMainContextInner(): MainContextDataType {
  const context = useContext(MainContext);

  if (!context) {
    throw new Error('MainContext not defined');
  }

  return context;
}
