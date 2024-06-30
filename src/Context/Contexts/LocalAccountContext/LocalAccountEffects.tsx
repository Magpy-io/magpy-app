import React, { ReactNode, useEffect } from 'react';

import { useMainContext } from '../MainContext';
import { useServerContext } from '../ServerContext';
import { useLocalAccountContextFunctions } from './useLocalAccountContext';

type PropsType = {
  children: ReactNode;
};

export const LocalAccountEffects: React.FC<PropsType> = props => {
  const { isServerReachable } = useServerContext();

  const { isUsingLocalAccount } = useMainContext();

  const { updateLocalAccountDetails } = useLocalAccountContextFunctions();

  useEffect(() => {
    if (isUsingLocalAccount && isServerReachable) {
      updateLocalAccountDetails().catch(console.log);
    }
  }, [isServerReachable, isUsingLocalAccount, updateLocalAccountDetails]);

  return props.children;
};
