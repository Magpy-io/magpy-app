import React, { ReactNode, createContext, useContext } from 'react';

import {
  StatePersistentDefaultValue,
  StatePersistentType,
  useStatePersistent,
} from '~/Hooks/useStatePersistent';

import { LocalAccountEffects } from './LocalAccountEffects';

export type LocalAccountDataType = {
  serverNameState: StatePersistentType<string | null>;
  usernameState: StatePersistentType<string | null>;
};

const initialState: LocalAccountDataType = {
  serverNameState: StatePersistentDefaultValue(null),
  usernameState: StatePersistentDefaultValue(null),
};

const LocalAccountContext = createContext<LocalAccountDataType>(initialState);

type PropsType = {
  children: ReactNode;
};

export const LocalAccountContextProvider: React.FC<PropsType> = props => {
  const serverNameState = useStatePersistent<string | null>(
    null,
    'ASYNC_STORAGE_KEY_LOCAL_CLAIM_SERVER_NAME',
  );
  const usernameState = useStatePersistent<string | null>(
    null,
    'ASYNC_STORAGE_KEY_LOCAL_CLAIM_USERNAME',
  );

  return (
    <LocalAccountContext.Provider value={{ serverNameState, usernameState }}>
      <LocalAccountEffects>{props.children}</LocalAccountEffects>
    </LocalAccountContext.Provider>
  );
};

export function useLocalAccountContextInternal(): LocalAccountDataType {
  const context = useContext(LocalAccountContext);

  if (!context) {
    throw new Error('LocalAccountContext not defined');
  }

  return context;
}
