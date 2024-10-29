import React, { ReactNode, useEffect } from 'react';

import { LOG } from '~/Helpers/Logging/Logger';

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
      FindServerLocal().catch(LOG.error);
    } else {
      FindServerRemote().catch(LOG.error);
    }
  }, [FindServerLocal, FindServerRemote, isUsingLocalAccount]);

  return props.children;
};
