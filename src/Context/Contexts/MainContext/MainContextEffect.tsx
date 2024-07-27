import React, { ReactNode, useEffect } from 'react';

import { useMainContext, useMainContextFunctions } from './useMainContext';

type PropsType = {
  children: ReactNode;
};

export const MainContextEffect: React.FC<PropsType> = props => {
  const { isNewUser, isContextLoaded } = useMainContext();
  const { clearContext } = useMainContextFunctions();

  useEffect(() => {
    if (isContextLoaded && isNewUser) {
      clearContext();
    }
  }, [clearContext, isContextLoaded, isNewUser]);

  return props.children;
};
