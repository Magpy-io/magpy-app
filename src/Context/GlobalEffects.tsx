import React, { ReactNode, useEffect } from 'react';

import { ClearOldLogFiles } from '~/Helpers/Logging/CleanLogs';

import { usePhotosStoreEffect } from './ReduxStore/Slices/Photos/PhotosFunctions';

type PropsType = {
  children: ReactNode;
};

export const GlobalEffects: React.FC<PropsType> = props => {
  usePhotosStoreEffect();

  useEffect(() => {
    ClearOldLogFiles().catch(console.log);
  }, []);

  return <>{props.children}</>;
};
