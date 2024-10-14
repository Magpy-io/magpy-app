import React, { ReactNode, createContext, useContext, useRef, useState } from 'react';

import { Invalidation } from './InvalidationTypes';
import { ServerInvalidationEffects } from './ServerInvalidationEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type FetchingStatus = 'Idle' | 'Fetching';
export type ResultStatus = 'Pending' | 'Success' | 'Failed';

export type ServerInvalidationDataType = {
  isRefreshing: boolean;
  fetchingStatus: FetchingStatus;
  resultStatus: ResultStatus;
  setIsRefreshing: SetStateType<boolean>;
  setFetchingStatus: SetStateType<FetchingStatus>;
  setResultStatus: SetStateType<ResultStatus>;
  isFetchingRef: React.MutableRefObject<boolean>;
  pendingInvalidations: Invalidation[];
  setPendingInvalidations: SetStateType<Invalidation[]>;
};

const initialState: ServerInvalidationDataType = {
  isRefreshing: false,
  fetchingStatus: 'Idle',
  resultStatus: 'Pending',
  setIsRefreshing: () => {},
  setFetchingStatus: () => {},
  setResultStatus: () => {},
  isFetchingRef: { current: false },
  pendingInvalidations: [],
  setPendingInvalidations: () => {},
};

const ServerInvalidationContext = createContext<ServerInvalidationDataType>(initialState);

type PropsType = {
  children: ReactNode;
};

export const ServerInvalidationContextProvider: React.FC<PropsType> = props => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [resultStatus, setResultStatus] = useState<ResultStatus>('Pending');
  const [fetchingStatus, setFetchingStatus] = useState<FetchingStatus>('Idle');
  const isFetchingRef = useRef(false);
  const [pendingInvalidations, setPendingInvalidations] = useState<Invalidation[]>([]);

  return (
    <ServerInvalidationContext.Provider
      value={{
        isRefreshing,
        resultStatus,
        fetchingStatus,
        setIsRefreshing,
        setResultStatus,
        setFetchingStatus,
        isFetchingRef,
        pendingInvalidations,
        setPendingInvalidations,
      }}>
      <ServerInvalidationEffects>{props.children}</ServerInvalidationEffects>
    </ServerInvalidationContext.Provider>
  );
};

export function useServerInvalidationContextInner(): ServerInvalidationDataType {
  const context = useContext(ServerInvalidationContext);

  if (!context) {
    throw new Error('ServerInvalidationContext not defined');
  }

  return context;
}
