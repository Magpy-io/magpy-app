import React, { ReactNode, useEffect } from 'react';

import { useMainContextFunctions } from './useMainContext';

type PropsType = {
  children: ReactNode;
};

export const MainContextEffect: React.FC<PropsType> = props => {
  const { loadIsNewUser, loadIsUsingLocalAccount } = useMainContextFunctions();

  useEffect(() => {
    const loadContextAsync = async () => {
      await loadIsNewUser();
      await loadIsUsingLocalAccount();
    };

    loadContextAsync().catch(console.log);
  }, [loadIsNewUser, loadIsUsingLocalAccount]);

  return props.children;
};
