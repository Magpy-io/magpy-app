import React, { ReactNode, createContext, useContext, useState } from 'react';

import { Types } from '~/Helpers/BackendQueries';
import {
  StatePersistentDefaultValue,
  StatePersistentType,
  useStatePersistent,
} from '~/Hooks/useStatePersistent';

import { AuthEffects } from './AuthEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type AuthDataType = {
  user: Types.UserType | null;
  loading: boolean;
  tokenState: StatePersistentType<string | null>;
};

const initialState: AuthDataType = {
  user: null,
  loading: true,
  tokenState: StatePersistentDefaultValue(null),
};

export type AuthDataSettersType = {
  setUser: SetStateType<Types.UserType | null>;
  setLoading: SetStateType<boolean>;
};

const initialStateSetters: AuthDataSettersType = {
  setUser: () => {},
  setLoading: () => {},
};

const AuthContext = createContext<AuthDataType>(initialState);
const AuthContextSetters = createContext<AuthDataSettersType>(initialStateSetters);

type PropsType = {
  children: ReactNode;
};

export const AuthContextProvider: React.FC<PropsType> = props => {
  const [user, setUser] = useState<Types.UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const tokenState = useStatePersistent<string | null>(
    null,
    'ASYNC_STORAGE_KEY_BACKEND_TOKEN',
  );

  return (
    <AuthContext.Provider value={{ user, loading, tokenState }}>
      <AuthContextSetters.Provider value={{ setUser, setLoading }}>
        <AuthEffects>{props.children}</AuthEffects>
      </AuthContextSetters.Provider>
    </AuthContext.Provider>
  );
};

export function useAuthContextInner(): AuthDataType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthContext not defined');
  }

  return context;
}

export function useAuthContextSettersInner(): AuthDataSettersType {
  const context = useContext(AuthContextSetters);

  if (!context) {
    throw new Error('AuthContext not defined');
  }

  return context;
}
