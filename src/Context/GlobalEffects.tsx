import React, { ReactNode } from 'react';

import { usePhotosStoreEffect } from './ReduxStore/Slices/Photos/PhotosFunctions';

type PropsType = {
  children: ReactNode;
};

export const GlobalEffects: React.FC<PropsType> = props => {
  usePhotosStoreEffect();

  return <>{props.children}</>;
};
