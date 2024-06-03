import React, { ReactNode } from 'react';

import { usePhotosStoreEffect } from './ReduxStore/Slices/Photos/PhotosFunctions';

type PropsType = {
  children: ReactNode;
};

const MainContextEffects: React.FC<PropsType> = props => {
  usePhotosStoreEffect();

  return <>{props.children}</>;
};

export default MainContextEffects;
