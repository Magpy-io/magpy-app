import React, { ReactNode, createContext, useContext, useState } from 'react';

import { LocalAccountEffects } from './LocalAccountEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type LocalAccountDataType = {
  isLocalAccount: boolean | null;
};

const initialState: LocalAccountDataType = {
  isLocalAccount: null,
};

export type LocalAccountDataSettersType = {
  setIsLocalAccount: SetStateType<boolean | null>;
};

const initialStateSetters: LocalAccountDataSettersType = {
  setIsLocalAccount: () => {},
};

const LocalAccountContext = createContext<LocalAccountDataType>(initialState);
const LocalAccountContextSetters =
  createContext<LocalAccountDataSettersType>(initialStateSetters);

type PropsType = {
  children: ReactNode;
};

export const LocalAccountContextProvider: React.FC<PropsType> = props => {
  const [isLocalAccount, setIsLocalAccount] = useState<boolean | null>(null);

  return (
    <LocalAccountContext.Provider value={{ isLocalAccount }}>
      <LocalAccountContextSetters.Provider value={{ setIsLocalAccount }}>
        <LocalAccountEffects>{props.children}</LocalAccountEffects>
      </LocalAccountContextSetters.Provider>
    </LocalAccountContext.Provider>
  );
};

export function useLocalAccountContext(): LocalAccountDataType {
  const context = useContext(LocalAccountContext);

  if (!context) {
    throw new Error('LocalAccountContext not defined');
  }

  return context;
}

export function useLocalAccountContextSetters(): LocalAccountDataSettersType {
  const context = useContext(LocalAccountContextSetters);

  if (!context) {
    throw new Error('LocalAccountContext not defined');
  }

  return context;
}
