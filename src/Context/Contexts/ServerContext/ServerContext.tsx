import React, { ReactNode, createContext, useContext, useState } from 'react';

import {
  StatePersistentDefaultValue,
  StatePersistentType,
  useStatePersistent,
} from '~/Hooks/useStatePersistent';

import { ServerEffects } from './ServerEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type ServerNetworkType = {
  currentPort: string;
  currentIp: string;
};

export type ServerContextDataType = {
  isServerReachable: boolean;
  serverNetworkState: StatePersistentType<ServerNetworkType | null>;
  tokenState: StatePersistentType<string | null>;
  findingServer: boolean;
};

const initialState: ServerContextDataType = {
  isServerReachable: false,
  serverNetworkState: StatePersistentDefaultValue(null),
  tokenState: StatePersistentDefaultValue(null),
  findingServer: false,
};

export type ServerContextDataSettersType = {
  setIsServerReachable: SetStateType<boolean>;
  setFindingServer: SetStateType<boolean>;
};

const initialStateSetters: ServerContextDataSettersType = {
  setIsServerReachable: () => {},
  setFindingServer: () => {},
};

const ServerContext = createContext<ServerContextDataType>(initialState);
const ServerContextSetters = createContext<ServerContextDataSettersType>(initialStateSetters);

type PropsType = {
  children: ReactNode;
};

export const ServerContextProvider: React.FC<PropsType> = props => {
  const [isServerReachable, setIsServerReachable] = useState(false);
  const [findingServer, setFindingServer] = useState(false);
  const serverNetworkState = useStatePersistent<ServerNetworkType | null>(
    null,
    'ASYNC_STORAGE_KEY_SERVER_NETWORK_INFO',
  );
  const tokenState = useStatePersistent<string | null>(null, 'ASYNC_STORAGE_KEY_SERVER_TOKEN');

  return (
    <ServerContext.Provider
      value={{ isServerReachable, serverNetworkState, tokenState, findingServer }}>
      <ServerContextSetters.Provider value={{ setIsServerReachable, setFindingServer }}>
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
