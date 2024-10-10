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
  neverAskForNotificationPermissionAgainState: StatePersistentType<boolean>;
};

const initialState: MainContextDataType = {
  isNewUserState: StatePersistentDefaultValue(true),
  isUsingLocalAccountState: StatePersistentDefaultValue(false),
  neverAskForNotificationPermissionAgainState: StatePersistentDefaultValue(false),
};

const MainContext = createContext<MainContextDataType>(initialState);

type PropsType = {
  children: ReactNode;
};

export const MainContextProvider: React.FC<PropsType> = props => {
  const isNewUserState = useStatePersistent(true, 'IS_NEW_USER');
  const isUsingLocalAccountState = useStatePersistent(false, 'IS_USING_LOCAL_ACCOUNT');
  const neverAskForNotificationPermissionAgainState = useStatePersistent(
    false,
    'NEVER_ASK_FOR_NOTIFICATION_PERMISSION_AGAIN',
  );

  return (
    <MainContext.Provider
      value={{
        isNewUserState,
        isUsingLocalAccountState,
        neverAskForNotificationPermissionAgainState,
      }}>
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
