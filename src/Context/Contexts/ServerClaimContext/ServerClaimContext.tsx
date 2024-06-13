import React, { ReactNode, createContext, useContext, useState } from 'react';

import { Types } from '~/Helpers/BackendQueries';

import { ServerClaimEffects } from './ServerClaimEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type ServerClaimDataType = {
  server: Types.ServerType | null;
};

const initialState: ServerClaimDataType = {
  server: null,
};

export type ServerClaimDataSettersType = {
  setServer: SetStateType<Types.ServerType | null>;
};

const initialStateSetters: ServerClaimDataSettersType = {
  setServer: () => {},
};

const ServerClaimContext = createContext<ServerClaimDataType>(initialState);
const ServerClaimContextSetters =
  createContext<ServerClaimDataSettersType>(initialStateSetters);

type PropsType = {
  children: ReactNode;
};

export const ServerClaimContextProvider: React.FC<PropsType> = props => {
  const [server, setServer] = useState<Types.ServerType | null>(null);

  return (
    <ServerClaimContext.Provider value={{ server }}>
      <ServerClaimContextSetters.Provider value={{ setServer }}>
        <ServerClaimEffects>{props.children}</ServerClaimEffects>
      </ServerClaimContextSetters.Provider>
    </ServerClaimContext.Provider>
  );
};

export function useServerClaimContext(): ServerClaimDataType {
  const context = useContext(ServerClaimContext);

  if (!context) {
    throw new Error('ServerClaimContext not defined');
  }

  return context;
}

export function useServerClaimContextSetters(): ServerClaimDataSettersType {
  const context = useContext(ServerClaimContextSetters);

  if (!context) {
    throw new Error('ServerClaimContext not defined');
  }

  return context;
}
