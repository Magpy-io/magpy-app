import React, { ReactNode } from 'react';

import { useBackgroundServiceEffects } from './useBackgroundService';

type PropsType = {
  children: ReactNode;
};

const MainContextEffects: React.FC<PropsType> = props => {
  useBackgroundServiceEffects();

  return <>{props.children}</>;
};

export default MainContextEffects;
