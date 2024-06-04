import React, { ReactNode, createContext, useContext, useState } from 'react';

import { LocalAccountEffects } from './LocalAccountEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type LocalAccountDataType = {
  isLocalAccount: boolean | null;
  serverIp: string | null;
  serverPort: string | null;
  serverToken: string | null;
};

const initialState: LocalAccountDataType = {
  isLocalAccount: null,
  serverIp: null,
  serverPort: null,
  serverToken: null,
};

export type LocalAccountDataSettersType = {
  setIsLocalAccount: SetStateType<boolean | null>;
  setServerIp: SetStateType<string | null>;
  setServerPort: SetStateType<string | null>;
  setServerToken: SetStateType<string | null>;
};

const initialStateSetters: LocalAccountDataSettersType = {
  setIsLocalAccount: () => {},
  setServerIp: () => {},
  setServerPort: () => {},
  setServerToken: () => {},
};

const LocalAccountContext = createContext<LocalAccountDataType>(initialState);
const LocalAccountContextSetters =
  createContext<LocalAccountDataSettersType>(initialStateSetters);

type PropsType = {
  children: ReactNode;
};

export const LocalAccountContextProvider: React.FC<PropsType> = props => {
  const [isLocalAccount, setIsLocalAccount] = useState<boolean | null>(null);
  const [serverIp, setServerIp] = useState<string | null>(null);
  const [serverPort, setServerPort] = useState<string | null>(null);
  const [serverToken, setServerToken] = useState<string | null>(null);

  return (
    <LocalAccountContext.Provider
      value={{ isLocalAccount, serverIp, serverPort, serverToken }}>
      <LocalAccountContextSetters.Provider
        value={{ setIsLocalAccount, setServerIp, setServerPort, setServerToken }}>
        <LocalAccountEffects>{props.children}</LocalAccountEffects>
      </LocalAccountContextSetters.Provider>
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

export function useLocalAccountContextSettersInternal(): LocalAccountDataSettersType {
  const context = useContext(LocalAccountContextSetters);

  if (!context) {
    throw new Error('LocalAccountContext not defined');
  }

  return context;
}
