import React, { ReactNode, useEffect } from 'react';

import { getIsUsingLocalAccount } from '~/Helpers/AsyncStorage';

import { useLocalAccountContext } from './LocalAccountContext';
import { useLocalAccountFunctions } from './useLocalAccountContext';

type PropsType = {
  children: ReactNode;
};

export const LocalAccountEffects: React.FC<PropsType> = props => {
  const { isLocalAccount } = useLocalAccountContext();

  const { setUsingLocalAccount } = useLocalAccountFunctions();

  useEffect(() => {
    async function loadIsLocalAccount() {
      const isLocalAccountStored = await getIsUsingLocalAccount();

      await setUsingLocalAccount(isLocalAccountStored ?? false);
    }

    if (isLocalAccount == null) {
      loadIsLocalAccount().catch(console.log);
    }
  }, [isLocalAccount, setUsingLocalAccount]);

  return props.children;
};
