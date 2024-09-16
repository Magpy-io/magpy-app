import React, { ReactNode, createContext, useContext, useRef, useState } from 'react';

import { Mutation } from './MutationsTypes';
import { ServerQueriesEffects } from './ServerQueriesEffects';

type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type FetchingStatus = 'Idle' | 'Fetching';
export type ResultStatus = 'Pending' | 'Success' | 'Failed';

export type ServerQueriesDataType = {
  fetchingStatus: FetchingStatus;
  resultStatus: ResultStatus;
  setFetchingStatus: SetStateType<FetchingStatus>;
  setResultStatus: SetStateType<ResultStatus>;
  isFetchingRef: React.MutableRefObject<boolean>;
  pendingMutations: Mutation[];
  setPendingMutations: SetStateType<Mutation[]>;
};

const initialState: ServerQueriesDataType = {
  fetchingStatus: 'Idle',
  resultStatus: 'Pending',
  setFetchingStatus: () => {},
  setResultStatus: () => {},
  isFetchingRef: { current: false },
  pendingMutations: [],
  setPendingMutations: () => {},
};

const ServerQueriesContext = createContext<ServerQueriesDataType>(initialState);

type PropsType = {
  children: ReactNode;
};

export const ServerQueriesProvider: React.FC<PropsType> = props => {
  const [resultStatus, setResultStatus] = useState<ResultStatus>('Pending');
  const [fetchingStatus, setFetchingStatus] = useState<FetchingStatus>('Idle');
  const isFetchingRef = useRef(false);
  const [pendingMutations, setPendingMutations] = useState<Mutation[]>([]);

  return (
    <ServerQueriesContext.Provider
      value={{
        resultStatus,
        fetchingStatus,
        setResultStatus,
        setFetchingStatus,
        isFetchingRef,
        pendingMutations,
        setPendingMutations,
      }}>
      <ServerQueriesEffects>{props.children}</ServerQueriesEffects>
    </ServerQueriesContext.Provider>
  );
};

export function useServerQueriesContextInner(): ServerQueriesDataType {
  const context = useContext(ServerQueriesContext);

  if (!context) {
    throw new Error('ServerQueriesContext not defined');
  }

  return context;
}
