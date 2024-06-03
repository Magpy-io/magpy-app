import React, { ReactNode, createContext, useContext, useState } from 'react';

import Zeroconf from 'react-native-zeroconf';

import { LocalServersEffects } from './LocalServersEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export const zeroconf = new Zeroconf();
console.log('Zeroconf initialized.');

export type Server = { name: string; ip: string; port: string };

export type LocalServersDataType = {
  localServers: Server[];
  isScanning: boolean;
};

const initialState: LocalServersDataType = {
  localServers: [],
  isScanning: false,
};

export type LocalServersDataSettersType = {
  setLocalServers: SetStateType<Server[]>;
  setIsScanning: SetStateType<boolean>;
};

const initialStateSetters: LocalServersDataSettersType = {
  setLocalServers: () => {},
  setIsScanning: () => {},
};

const LocalServersContext = createContext<LocalServersDataType>(initialState);
const LocalServersContextSetters =
  createContext<LocalServersDataSettersType>(initialStateSetters);

type PropsType = {
  children: ReactNode;
};

export const LocalServersContextProvider: React.FC<PropsType> = props => {
  const [localServers, setLocalServers] = useState<Server[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  return (
    <LocalServersContext.Provider value={{ localServers, isScanning }}>
      <LocalServersContextSetters.Provider value={{ setLocalServers, setIsScanning }}>
        <LocalServersEffects>{props.children}</LocalServersEffects>
      </LocalServersContextSetters.Provider>
    </LocalServersContext.Provider>
  );
};

export function useLocalServersContext(): LocalServersDataType {
  const context = useContext(LocalServersContext);

  if (!context) {
    throw new Error('LocalServersContext not defined');
  }

  return context;
}

export function useLocalServersContextSetters(): LocalServersDataSettersType {
  const context = useContext(LocalServersContextSetters);

  if (!context) {
    throw new Error('LocalServersContext not defined');
  }

  return context;
}
