import React, { ReactNode, createContext, useContext, useState } from 'react';

import {
  StatePersistentDefaultValue,
  StatePersistentType,
  useStatePersistent,
} from '~/Hooks/useStatePersistent';

import { ServerEffects } from './ServerEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type ConnectingToServerError = 'SERVER_AUTH_FAILED' | 'SERVER_NOT_REACHABLE' | null;

export type ServerNetworkType = {
  currentPort: string;
  currentIp: string;
};

export type ServerContextDataType = {
  isServerReachable: boolean;
  serverNetworkState: StatePersistentType<ServerNetworkType | null>;
  serverNetworkSelecting: ServerNetworkType | null;
  tokenState: StatePersistentType<string | null>;
  findingServer: boolean;
  error: ConnectingToServerError;
};

const initialState: ServerContextDataType = {
  isServerReachable: false,
  serverNetworkState: StatePersistentDefaultValue(null),
  serverNetworkSelecting: null,
  tokenState: StatePersistentDefaultValue(null),
  findingServer: false,
  error: null,
};

export type ServerContextDataSettersType = {
  setIsServerReachable: SetStateType<boolean>;
  setFindingServer: SetStateType<boolean>;
  setServerNetworkSelecting: SetStateType<ServerNetworkType | null>;
  setError: SetStateType<ConnectingToServerError>;
};

const initialStateSetters: ServerContextDataSettersType = {
  setIsServerReachable: () => {},
  setFindingServer: () => {},
  setError: () => {},
  setServerNetworkSelecting: () => {},
};

const ServerContext = createContext<ServerContextDataType>(initialState);
const ServerContextSetters = createContext<ServerContextDataSettersType>(initialStateSetters);

type PropsType = {
  children: ReactNode;
};

export const ServerContextProvider: React.FC<PropsType> = props => {
  const [isServerReachable, setIsServerReachable] = useState(false);
  const [findingServer, setFindingServer] = useState(false);
  const [error, setError] = useState<ConnectingToServerError>(null);
  const serverNetworkState = useStatePersistent<ServerNetworkType | null>(
    null,
    'SERVER_NETWORK_INFO',
  );
  const tokenState = useStatePersistent<string | null>(null, 'SERVER_TOKEN');
  const [serverNetworkSelecting, setServerNetworkSelecting] =
    useState<ServerNetworkType | null>(null);

  return (
    <ServerContext.Provider
      value={{
        isServerReachable,
        serverNetworkState,
        tokenState,
        findingServer,
        error,
        serverNetworkSelecting,
      }}>
      <ServerContextSetters.Provider
        value={{
          setIsServerReachable,
          setFindingServer,
          setError,
          setServerNetworkSelecting,
        }}>
        <ServerEffects>{props.children}</ServerEffects>
      </ServerContextSetters.Provider>
    </ServerContext.Provider>
  );
};

export function useServerContextInner(): ServerContextDataType {
  const context = useContext(ServerContext);

  if (!context) {
    throw new Error('ServerContext not defined');
  }

  return context;
}

export function useServerContextSettersInner(): ServerContextDataSettersType {
  const context = useContext(ServerContextSetters);

  if (!context) {
    throw new Error('ServerContext not defined');
  }

  return context;
}
