import React, { ReactNode, useEffect } from 'react';

import { useMainContextFunctions } from './useMainContext';

type PropsType = {
  children: ReactNode;
};

export const MainContextEffect: React.FC<PropsType> = props => {
  const { loadIsNewUser } = useMainContextFunctions();

  useEffect(() => {
    const loadContextAsync = async () => {
      await loadIsNewUser();
    };

    loadContextAsync().catch(console.log);
  }, [loadIsNewUser]);

  return props.children;
};
