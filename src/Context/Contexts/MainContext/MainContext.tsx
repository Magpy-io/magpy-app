import React, { ReactNode, createContext, useContext } from 'react';

import {
  StatePersistentDefaultValue,
  StatePersistentType,
  useStatePersistent,
} from '~/Hooks/useStatePersistent';

import { MainContextEffect } from './MainContextEffect';

export type MainContextDataType = {
  isNewUserState: StatePersistentType<boolean>;
  isUsingLocalAccountState: StatePersistentType<boolean>;
};

const initialState: MainContextDataType = {
  isNewUserState: StatePersistentDefaultValue(true),
  isUsingLocalAccountState: StatePersistentDefaultValue(false),
};

const MainContext = createContext<MainContextDataType>(initialState);

type PropsType = {
  children: ReactNode;
};

export const MainContextProvider: React.FC<PropsType> = props => {
  const isNewUserState = useStatePersistent(true, 'IS_NEW_USER');
  const isUsingLocalAccountState = useStatePersistent(false, 'IS_USING_LOCAL_ACCOUNT');

  return (
    <MainContext.Provider value={{ isNewUserState, isUsingLocalAccountState }}>
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
