import React, { ReactNode, useEffect } from 'react';

import { useAuthContext } from '../AuthContext';
import { useLocalServersFunctions } from '../LocalServersContext';
import { useMainContext } from '../MainContext';
import { useServerClaimContext } from '../ServerClaimContext';
import { useServerContextSettersInner } from './ServerContext';
import { useFindServerFunctions } from './useFindServerFunctions';
import { useServerContext, useServerContextFunctions } from './useServerContext';

type PropsType = {
  children: ReactNode;
};

export const ServerEffects: React.FC<PropsType> = props => {
  const { setReachableServer } = useServerContextFunctions();
  const { FindServerLocal, FindServerRemote } = useFindServerFunctions();
  const { serverNetwork, token: serverToken, isServerReachable } = useServerContext();
  const { searchAsync } = useLocalServersFunctions();
  const { setError, setFindingServer } = useServerContextSettersInner();

  const { server: claimedServer } = useServerClaimContext();

  const { loading, token: backendToken } = useAuthContext();

  const { isUsingLocalAccount } = useMainContext();

  useEffect(() => {
    console.log('ServerEffect');

    if (isUsingLocalAccount) {
      FindServerLocal().catch(console.log);
    } else {
      FindServerRemote().catch(console.log);
    }
  }, [
    searchAsync,
    backendToken,
    claimedServer,
    setReachableServer,
    isUsingLocalAccount,
    serverToken,
    serverNetwork,
    isServerReachable,
    setFindingServer,
    setError,
    FindServerLocal,
    FindServerRemote,
    loading,
  ]);

  return props.children;
};
