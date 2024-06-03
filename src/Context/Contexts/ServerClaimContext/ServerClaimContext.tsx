import React, { ReactNode, createContext, useContext, useState } from 'react';

import { Types } from '~/Helpers/BackendQueries';

import { ServerClaimEffects } from './ServerClaimEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type ServerClaimDataType = {
  server: Types.ServerType | null;
  hasServer: boolean;
};

const initialState: ServerClaimDataType = {
  server: null,
  hasServer: false,
};

export type ServerClaimDataSettersType = {
  setServer: SetStateType<Types.ServerType | null>;
  setHasServer: SetStateType<boolean>;
};

const initialStateSetters: ServerClaimDataSettersType = {
  setServer: () => {},
  setHasServer: () => {},
};

const ServerClaimContext = createContext<ServerClaimDataType>(initialState);
const ServerClaimContextSetters =
  createContext<ServerClaimDataSettersType>(initialStateSetters);

type PropsType = {
  children: ReactNode;
};

export const ServerClaimContextProvider: React.FC<PropsType> = props => {
  const [server, setServer] = useState<Types.ServerType | null>(null);
  const [hasServer, setHasServer] = useState<boolean>(true);

  return (
    <ServerClaimContext.Provider value={{ server, hasServer }}>
      <ServerClaimContextSetters.Provider value={{ setServer, setHasServer }}>
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
