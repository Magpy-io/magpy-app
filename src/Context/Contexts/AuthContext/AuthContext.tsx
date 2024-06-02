import React, { ReactNode, createContext, useContext, useState } from 'react';

import { Types } from '~/Helpers/BackendQueries';

import { AuthEffects } from './AuthEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type AuthDataType = {
  user: Types.UserType | null;
  loading: boolean;
  token: string | null;
};

const initialState: AuthDataType = {
  user: null,
  loading: true,
  token: null,
};

export type AuthDataSettersType = {
  setUser: SetStateType<Types.UserType | null>;
  setLoading: SetStateType<boolean>;
  setToken: SetStateType<string | null>;
};

const initialStateSetters: AuthDataSettersType = {
  setUser: () => {},
  setLoading: () => {},
  setToken: () => {},
};

const AuthContext = createContext<AuthDataType>(initialState);
const AuthContextSetters = createContext<AuthDataSettersType>(initialStateSetters);

type PropsType = {
  children: ReactNode;
};

export const AuthContextProvider: React.FC<PropsType> = props => {
  const [user, setUser] = useState<Types.UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ user, loading, token }}>
      <AuthContextSetters.Provider value={{ setUser, setLoading, setToken }}>
        <AuthEffects>{props.children}</AuthEffects>
      </AuthContextSetters.Provider>
    </AuthContext.Provider>
  );
};

export function useAuthContext(): AuthDataType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('AuthContext not defined');
  }

  return context;
}

export function useAuthContextSetters(): AuthDataSettersType {
  const context = useContext(AuthContextSetters);

  if (!context) {
    throw new Error('AuthContext not defined');
  }

  return context;
}
