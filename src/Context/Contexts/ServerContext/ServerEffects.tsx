import React, { ReactNode, useEffect } from 'react';

import { useMainContext } from '../MainContext';
import { useFindServerFunctions } from './useFindServerFunctions';

type PropsType = {
  children: ReactNode;
};

export const ServerEffects: React.FC<PropsType> = props => {
  const { FindServerLocal, FindServerRemote } = useFindServerFunctions();

  const { isUsingLocalAccount } = useMainContext();

  useEffect(() => {
    if (isUsingLocalAccount) {
      FindServerLocal().catch(console.log);
    } else {
      FindServerRemote().catch(console.log);
    }
  }, [FindServerLocal, FindServerRemote, isUsingLocalAccount]);

  return props.children;
};
