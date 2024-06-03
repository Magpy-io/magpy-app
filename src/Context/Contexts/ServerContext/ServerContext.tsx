import React, { ReactNode, createContext, useContext, useState } from 'react';

import { ServerEffects } from './ServerEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type ServerNetworkType = {
  ipLocal: string | null;
  ipPublic: string | null;
  port: string | null;
  currentIp: string | null;
};

export type ServerContextDataType = {
  isServerReachable: boolean;
  serverNetwork: ServerNetworkType;
  serverSearchFailed: boolean;
};

const initialState: ServerContextDataType = {
  isServerReachable: false,
  serverNetwork: {
    ipLocal: null,
    ipPublic: null,
    port: null,
    currentIp: null,
  },
  serverSearchFailed: false,
};

export type ServerContextDataSettersType = {
  setIsServerReachable: SetStateType<boolean>;
  setServerNetwork: SetStateType<ServerNetworkType>;
  setServerSearchFailed: SetStateType<boolean>;
};

const initialStateSetters: ServerContextDataSettersType = {
  setIsServerReachable: () => {},
  setServerNetwork: () => {},
  setServerSearchFailed: () => {},
};

const ServerContext = createContext<ServerContextDataType>(initialState);
const ServerContextSetters = createContext<ServerContextDataSettersType>(initialStateSetters);

type PropsType = {
  children: ReactNode;
};

export const ServerContextProvider: React.FC<PropsType> = props => {
  const [isServerReachable, setIsServerReachable] = useState(false);
  const [serverSearchFailed, setServerSearchFailed] = useState(false);
  const [serverNetwork, setServerNetwork] = useState<ServerNetworkType>({
    ipLocal: null,
    ipPublic: null,
    port: null,
    currentIp: null,
  });

  return (
    <ServerContext.Provider value={{ isServerReachable, serverNetwork, serverSearchFailed }}>
      <ServerContextSetters.Provider
        value={{ setIsServerReachable, setServerNetwork, setServerSearchFailed }}>
        <ServerEffects>{props.children}</ServerEffects>
      </ServerContextSetters.Provider>
    </ServerContext.Provider>
  );
};

export function useServerContext(): ServerContextDataType {
  const context = useContext(ServerContext);

  if (!context) {
    throw new Error('ServerContext not defined');
  }

  return context;
}

export function useServerContextSetters(): ServerContextDataSettersType {
  const context = useContext(ServerContextSetters);

  if (!context) {
    throw new Error('ServerContext not defined');
  }

  return context;
}
