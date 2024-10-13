import React, { ReactNode, useEffect } from 'react';

import { useToast } from '~/Hooks/useToast';

import { useMainContext } from '../MainContext';
import { useServerContext } from '../ServerContext';
import { useLocalAccountContextFunctions } from './useLocalAccountContext';

type PropsType = {
  children: ReactNode;
};

export const LocalAccountEffects: React.FC<PropsType> = props => {
  const { isServerReachable } = useServerContext();

  const { isUsingLocalAccount } = useMainContext();

  const { showToastError } = useToast();
  const { updateLocalAccountDetails } = useLocalAccountContextFunctions();

  useEffect(() => {
    if (isUsingLocalAccount && isServerReachable) {
      updateLocalAccountDetails().catch(err => {
        showToastError('Error getting server info.');
        console.log(err);
      });
    }
  }, [isServerReachable, isUsingLocalAccount, updateLocalAccountDetails, showToastError]);

  return props.children;
};
