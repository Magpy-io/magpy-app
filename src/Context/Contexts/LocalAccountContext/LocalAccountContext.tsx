import React, { ReactNode, createContext, useContext, useState } from 'react';

import { LocalAccountEffects } from './LocalAccountEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type LocalAccountDataType = {
  serverIp: string | null;
  serverPort: string | null;
  serverToken: string | null;
};

const initialState: LocalAccountDataType = {
  serverIp: null,
  serverPort: null,
  serverToken: null,
};

export type LocalAccountDataSettersType = {
  setServerIp: SetStateType<string | null>;
  setServerPort: SetStateType<string | null>;
  setServerToken: SetStateType<string | null>;
};

const initialStateSetters: LocalAccountDataSettersType = {
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
  const [serverIp, setServerIp] = useState<string | null>(null);
  const [serverPort, setServerPort] = useState<string | null>(null);
  const [serverToken, setServerToken] = useState<string | null>(null);

  return (
    <LocalAccountContext.Provider value={{ serverIp, serverPort, serverToken }}>
      <LocalAccountContextSetters.Provider
        value={{ setServerIp, setServerPort, setServerToken }}>
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
