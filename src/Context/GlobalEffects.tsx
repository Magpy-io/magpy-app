import React, { ReactNode, useEffect } from 'react';

import { ClearOldLogFiles } from '~/Helpers/Logging/CleanLogs';
import { LOG } from '~/Helpers/Logging/Logger';

import { usePhotosStoreEffect } from './ReduxStore/Slices/Photos/PhotosFunctions';

type PropsType = {
  children: ReactNode;
};

export const GlobalEffects: React.FC<PropsType> = props => {
  usePhotosStoreEffect();

  useEffect(() => {
    ClearOldLogFiles().catch(LOG.error);
  }, []);

  return <>{props.children}</>;
};
