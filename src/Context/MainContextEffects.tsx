import React, { ReactNode } from 'react';

import { useAuthDataEffect } from './ContextSlices/AuthContext';
import { useBackgroundServiceEffects } from './ContextSlices/BackgroundServiceContext';
import { useLocalServersEffect } from './ContextSlices/LocalServersContext';
import { useServerClaimEffects } from './ContextSlices/ServerClaimContext';
import { useServerEffect } from './ContextSlices/ServerContext';

type PropsType = {
  children: ReactNode;
};

const MainContextEffects: React.FC<PropsType> = props => {
  useAuthDataEffect();
  useLocalServersEffect();
  useBackgroundServiceEffects();
  useServerClaimEffects();
  useServerEffect();

  return <>{props.children}</>;
};

export default MainContextEffects;
